const cron = require('node-cron');
const TweetManager = require('./tweetManager');
const TwitterActions = require('./twitterActions');

class Scheduler {
  constructor() {
    this.tweetManager = new TweetManager();
    this.twitterActions = new TwitterActions();
    this.isRunning = false;
    this.cronJob = null;
  }

  async checkScheduledTweets() {
    if (this.twitterActions.isPosting) {
      console.log('⏳ Already posting, skipping check...');
      return;
    }

    const pendingTweets = this.tweetManager.getPendingTweets();
    
    if (pendingTweets.length === 0) {
      return; // Silent when no tweets to post
    }

    console.log(`📅 Found ${pendingTweets.length} tweet(s) ready to post`);
    
    // Post tweets one by one to avoid conflicts
    for (const tweet of pendingTweets) {
      try {
        console.log(`\n🐦 Posting: "${tweet.content.substring(0, 50)}..."`);
        
        const success = await this.twitterActions.postTweet(
          tweet.content, 
          tweet.imagePath || null
        );
        
        if (success) {
          this.tweetManager.markAsPosted(tweet.id);
          console.log('✅ Tweet posted and marked as complete');
        } else {
          console.log('❌ Tweet posting failed, will retry next cycle');
        }
        
        // Delay between tweets to avoid rate limiting
        if (pendingTweets.length > 1) {
          console.log('⏱️ Waiting 30 seconds before next tweet...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
        
      } catch (error) {
        console.error(`❌ Error posting tweet ${tweet.id}:`, error.message);
      }
    }
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Scheduler already running');
      return;
    }

    console.log('🤖 Starting Twitter scheduler...');
    console.log('⏰ Checking for tweets every minute');
    
    // Check every minute for scheduled tweets
    this.cronJob = cron.schedule('* * * * *', async () => {
      await this.checkScheduledTweets();
    });

    this.isRunning = true;
    console.log('✅ Scheduler is now running!');
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    
    this.isRunning = false;
    console.log('🛑 Scheduler stopped');
  }

  restart() {
    this.stop();
    setTimeout(() => this.start(), 1000);
  }

  getStatus() {
    const stats = this.tweetManager.getStats();
    
    console.log('\n📊 Scheduler Status:');
    console.log(`Status: ${this.isRunning ? '🟢 Running' : '🔴 Stopped'}`);
    console.log(`Total tweets: ${stats.total}`);
    console.log(`Posted: ${stats.posted}`);
    console.log(`Scheduled: ${stats.scheduled}`);
    console.log(`Ready now: ${stats.pending}`);
    
    return {
      running: this.isRunning,
      ...stats
    };
  }

  // Convenience methods
  async postNow(content, imagePath = null) {
    console.log('🚀 Posting tweet immediately...');
    return await this.twitterActions.postTweet(content, imagePath);
  }

  addTweet(content, scheduleTime, imagePath = null) {
    return this.tweetManager.addTweet(content, scheduleTime, imagePath);
  }

  listTweets() {
    this.tweetManager.listScheduledTweets();
  }

  deleteTweet(id) {
    return this.tweetManager.deleteTweet(id);
  }

  async cleanup() {
    this.stop();
    await this.twitterActions.logout();
    console.log('🧹 Scheduler cleaned up');
  }
}

module.exports = Scheduler;