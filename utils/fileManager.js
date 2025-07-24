const fs = require('fs');

class FileManager {
  constructor(filePath = 'tweets.json') {
    this.filePath = filePath;
  }

  loadTweets() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('📁 Creating new tweets.json file');
      return [];
    }
  }

  saveTweets(tweets) {
    fs.writeFileSync(this.filePath, JSON.stringify(tweets, null, 2));
  }

  fileExists(path) {
    return fs.existsSync(path);
  }

  backupTweets() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `backup/tweets-${timestamp}.json`;
    
    try {
      if (!fs.existsSync('backup')) {
        fs.mkdirSync('backup');
      }
      fs.copyFileSync(this.filePath, backupPath);
      console.log(`💾 Backup created: ${backupPath}`);
    } catch (error) {
      console.warn('⚠️ Backup failed:', error.message);
    }
  }
}

module.exports = FileManager;