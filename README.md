# Twitter Scheduler with Puppeteer

A free Node.js-based Twitter scheduler that automates tweet posting using Puppeteer (headless browser automation).

## ⚠ IMPORTANT DISCLAIMERS

###  HIGH VOLATILITY WARNING
This tool is **extremely volatile** and requires constant maintenance:

- **Twitter UI changes frequently** - selectors break regularly
- **Expect failures** - Twitter updates can break this overnight
- **Manual updates required** - You'll need to fix selectors monthly/weekly
- **No guarantees** - This is a reverse-engineering approach that Twitter actively works against

###  Terms of Service & Risks
- **Violates Twitter's Terms of Service** - Use at your own risk
- **Account suspension risk** - Twitter may ban accounts using automated tools
- **Security concerns** - Stores credentials locally
- **Not production-ready** - Educational/personal use only

### 🎯 Recommended Alternatives
- **Twitter API v2** (Free tier: 1,500 tweets/month)


---

## 🚀 Features

- Schedule tweets with cron expressions
- CLI interface for tweet management
- JSON-based tweet storage
- Human-like posting delays
- Immediate posting capability
- Error handling and recovery

##  Installation

### Prerequisites
- Node.js 16+ installed
- Chrome/Chromium browser

### Setup

1. **Clone and setup:**
```bash
mkdir twitter-scheduler
cd twitter-scheduler
npm init -y
npm install puppeteer node-cron dotenv
```

2. **Create environment file (.env):**
```env
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
```

3. **Create tweets storage file (tweets.json):**
```json
[]
```

4. **Add the main script** (save as `twitter-scheduler.js`)

## 🎮 Usage

### Start the Scheduler
```bash
node twitter-scheduler.js
```

### CLI Commands
- `list` - Show all scheduled tweets
- `add` - Add new scheduled tweet (interactive)
- `delete [id]` - Delete scheduled tweet by ID
- `post [message]` - Post tweet immediately
- `quit` - Exit application

### Programmatic Usage
```javascript
const TwitterScheduler = require('./twitter-scheduler');
const scheduler = new TwitterScheduler();

// Schedule a tweet
scheduler.addTweet(
  'Hello world! 🌍', 
  '2024-01-15 14:30:00'
);

// Start scheduler
scheduler.startScheduler();
```

## ⚙️ Configuration

### Cron Schedule Examples
```javascript
// Every minute
cron.schedule('* * * * *', callback);

// Every day at 9 AM
cron.schedule('0 9 * * *', callback);

// Every Monday at 10 AM
cron.schedule('0 10 * * 1', callback);

// Every hour
cron.schedule('0 * * * *', callback);
```

### Tweet JSON Structure
```json
[
  {
    "id": 1642234567890,
    "content": "My scheduled tweet content",
    "scheduleTime": "2024-01-15 14:30:00",
    "posted": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "postedAt": null
  }
]
```

## 🔧 Troubleshooting

### Common Issues & Fixes

#### 1. Login Failures
- **Problem:** Can't find login selectors
- **Fix:** Update selectors in `postTweet()` method
- **Check:** Twitter's login page HTML structure

#### 2. Tweet Compose Failures
- **Problem:** Can't find tweet textarea
- **Fix:** Update `[data-testid="tweetTextarea_0"]` selector
- **Check:** Twitter's compose tweet HTML

#### 3. Post Button Not Working
- **Problem:** Can't click tweet button
- **Fix:** Update `[data-testid="tweetButtonInline"]` selector
- **Check:** Twitter's tweet button HTML

#### 4. 2FA Issues
- **Problem:** Two-factor authentication blocking login
- **Solution:** Disable 2FA or implement 2FA handling code

### Debugging Steps
1. Set `headless: false` to watch browser actions
2. Add `await page.screenshot({path: 'debug.png'})` before failures
3. Use `console.log(await page.content())` to inspect HTML
4. Check browser console for JavaScript errors

## 🛠️ Maintenance

### Regular Updates Needed

#### Weekly Checks
- Verify login selectors still work
- Test tweet posting functionality
- Update selectors if Twitter UI changed

#### Monthly Tasks
- Review Twitter's Terms of Service changes
- Update Puppeteer to latest version
- Check for new anti-bot measures

#### Selector Update Process
1. Open Twitter in browser
2. Inspect elements (F12)
3. Find new `data-testid` or CSS selectors
4. Update code with new selectors
5. Test thoroughly

### Common Selector Updates
```javascript
// Login username field
'[name="text"]' // Current
'[autocomplete="username"]' // Alternative

// Password field
'[name="password"]' // Current
'[type="password"]' // Alternative

// Tweet textarea
'[data-testid="tweetTextarea_0"]' // Current
'[role="textbox"][data-testid*="tweet"]' // Alternative

// Tweet button
'[data-testid="tweetButtonInline"]' // Current
'[data-testid="tweetButton"]' // Alternative
```

## 🔐 Security Considerations

- Store credentials in `.env` file (never commit to git)
- Add `.env` to `.gitignore`
- Consider using app passwords instead of main password
- Run on secure, private network only
- Regularly rotate credentials

## 📝 Development

### Adding Features

#### Image Support
```javascript
// Add to postTweet method
await page.click('[data-testid="attachments"]');
const fileInput = await page.$('input[type="file"]');
await fileInput.uploadFile('./image.jpg');
```

#### Thread Support
```javascript
// Add thread functionality
async postThread(tweets) {
  for (let i = 0; i < tweets.length; i++) {
    await this.postTweet(tweets[i]);
    if (i < tweets.length - 1) {
      await this.randomDelay(2000, 5000);
    }
  }
}
```

## 📄 License

MIT License - Use at your own risk

## 🤝 Contributing

This project requires constant maintenance due to Twitter's changing UI. Contributions welcome:

1. Fork the repository
2. Create feature branch
3. Test thoroughly with current Twitter UI
4. Submit pull request with selector updates

## 📞 Support

**Important:** This is an educational project. Support is limited due to the volatile nature of web scraping Twitter.

- Open issues for selector updates
- Share working selector combinations
- Report new anti-bot measures

---

**Last Updated:** January 2024
**Twitter UI Compatibility:** Tested with Twitter as of January 2024
**Next Update Required:** Likely within 2-4 weeks
