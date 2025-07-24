const FileManager = require('../utils/fileManager');

class TweetManager {
  constructor() {
    this.fileManager = new FileManager();
    this.tweets = this.fileManager.loadTweets();
  }

  addTweet(content, scheduleTime, imagePath = null) {
    const tweet = {
      id: Date.now(),
      content,
      scheduleTime,
      posted: false,
      createdAt: new Date().toISOString(),
      ...(imagePath && { hasImage: true, imagePath })
    };

    this.tweets.push(tweet);
    this.fileManager.saveTweets(this.tweets);
    
    console.log(`✅ Tweet scheduled for ${scheduleTime}${imagePath ? ' (with image)' : ''}`);
    return tweet;
  }

  getScheduledTweets() {
    return this.tweets.filter(t => !t.posted);
  }

  getPostedTweets() {
    return this.tweets.filter(t => t.posted);
  }

  getPendingTweets() {
    const now = new Date();
    return this.tweets.filter(tweet => 
      !tweet.posted && new Date(tweet.scheduleTime) <= now
    );
  }

  markAsPosted(tweetId) {
    const tweet = this.tweets.find(t => t.id === tweetId);
    if (tweet) {
      tweet.posted = true;
      tweet.postedAt = new Date().toISOString();
      this.fileManager.saveTweets(this.tweets);
      return true;
    }
    return false;
  }

  deleteTweet(id) {
    const initialLength = this.tweets.length;
    this.tweets = this.tweets.filter(t => t.id !== parseInt(id));
    
    if (this.tweets.length < initialLength) {
      this.fileManager.saveTweets(this.tweets);
      console.log(`🗑️ Tweet ${id} deleted`);
      return true;
    }
    
    console.log(`❌ Tweet ${id} not found`);
    return false;
  }

  listScheduledTweets() {
    const pending = this.getScheduledTweets();
    console.log('\n📋 Scheduled Tweets:');
    
    if (pending.length === 0) {
      console.log('No scheduled tweets');
      return;
    }

    pending.forEach(tweet => {
      const imageIcon = tweet.hasImage ? ' 🖼️' : '';
      const status = new Date(tweet.scheduleTime) <= new Date() ? ' ⏰ READY' : ' ⏳ PENDING';
      console.log(`${tweet.id}: "${tweet.content}" - ${tweet.scheduleTime}${imageIcon}${status}`);
    });
  }

  getStats() {
    const total = this.tweets.length;
    const posted = this.getPostedTweets().length;
    const scheduled = this.getScheduledTweets().length;
    const pending = this.getPendingTweets().length;

    return { total, posted, scheduled, pending };
  }
}

module.exports = TweetManager;