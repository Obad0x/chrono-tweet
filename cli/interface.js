const readline = require('readline');

class CLIInterface {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  showWelcome() {
    console.log('\n🐦 Twitter Scheduler CLI');
    console.log('========================');
    this.showCommands();
  }

  showCommands() {
    console.log('\n📋 Available Commands:');
    console.log('• list          - Show scheduled tweets');
    console.log('• add           - Add new scheduled tweet');
    console.log('• delete <id>   - Delete tweet by ID');
    console.log('• post <text>   - Post tweet immediately');
    console.log('• status        - Show scheduler status');
    console.log('• start         - Start scheduler');
    console.log('• stop          - Stop scheduler');
    console.log('• restart       - Restart scheduler');
    console.log('• help          - Show this help');
    console.log('• quit          - Exit program\n');
  }

  async promptInput(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async addTweetInteractive() {
    try {
      const content = await this.promptInput('📝 Enter tweet content: ');
      if (!content) {
        console.log('❌ Tweet content cannot be empty');
        return;
      }

      const scheduleTime = await this.promptInput('📅 Enter schedule time (YYYY-MM-DD HH:MM:SS): ');
      if (!scheduleTime) {
        console.log('❌ Schedule time cannot be empty');
        return;
      }

      const imagePath = await this.promptInput('🖼️ Enter image path (optional, press Enter to skip): ');
      
      this.scheduler.addTweet(
        content, 
        scheduleTime, 
        imagePath || null
      );

    } catch (error) {
      console.error('❌ Error adding tweet:', error.message);
    }
  }

  async handleCommand(input) {
    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();

    try {
      switch (command) {
        case 'list':
          this.scheduler.listTweets();
          break;

        case 'add':
          await this.addTweetInteractive();
          break;

        case 'delete':
          if (args[1]) {
            this.scheduler.deleteTweet(args[1]);
          } else {
            console.log('❌ Please provide tweet ID: delete <id>');
          }
          break;

        case 'post':
          const message = args.slice(1).join(' ');
          if (message) {
            const success = await this.scheduler.postNow(message);
            if (success) {
              console.log('✅ Tweet posted successfully!');
            } else {
              console.log('❌ Failed to post tweet');
            }
          } else {
            console.log('❌ Please provide message: post <message>');
          }
          break;

        case 'status':
          this.scheduler.getStatus();
          break;

        case 'start':
          this.scheduler.start();
          break;

        case 'stop':
          this.scheduler.stop();
          break;

        case 'restart':
          this.scheduler.restart();
          break;

        case 'help':
          this.showCommands();
          break;

        case 'quit':
        case 'exit':
          await this.cleanup();
          process.exit(0);
          break;

        case '':
          // Empty command, do nothing
          break;

        default:
          console.log(`❌ Unknown command: ${command}`);
          console.log('Type "help" for available commands');
          break;
      }
    } catch (error) {
      console.error('❌ Command error:', error.message);
    }
  }

  start() {
    this.showWelcome();
    
    this.rl.on('line', async (input) => {
      await this.handleCommand(input);
      this.showPrompt();
    });

    this.showPrompt();
  }

  showPrompt() {
    process.stdout.write('\n> ');
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    await this.scheduler.cleanup();
    this.rl.close();
  }
}

module.exports = CLIInterface;