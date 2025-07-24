# Twitter Scheduler with Puppeteer

Automate Twitter posts using Node.js and browser automation. **Free alternative to Twitter API.**

## Important Warnings

- **Violates Twitter's Terms of Service** - Use at your own risk
- **Account suspension possible** - Twitter may ban automated accounts
- **Requires constant updates** - Twitter UI changes break selectors frequently
- **Educational use only** - Not recommended for production

## Quick Start

```bash
# 1. Clone and install
git clone [repo-url]
cd twitter-scheduler
npm install puppeteer-extra puppeteer-extra-plugin-stealth node-cron dotenv

# 2. Setup environment
echo "TWITTER_USERNAME=your_username" > .env
echo "TWITTER_PASSWORD=your_password" >> .env

# 3. Run
node index.js
```

## Project Structure

```
twitter-scheduler/
├── index.js                 # Main entry point
├── tweets.json              # Tweet storage
├── .env                     # Your credentials
├── modules/
│   ├── scheduler.js         # Cron job manager
│   ├── twitterActions.js    # Browser automation
│   ├── tweetManager.js      # Tweet CRUD operations
│   └── browserManager.js    # Browser setup
├── utils/fileManager.js     # File operations
└── cli/interface.js         # Command line interface
```

## CLI Commands

```
> list              # Show scheduled tweets
> add               # Add new tweet (interactive)
> delete 123        # Delete tweet by ID
> post Hello World  # Post immediately
> status            # Show scheduler status
> quit              # Exit
```

## Adding Tweets

**Method 1: CLI**
```
> add
📝 Enter tweet content: Hello world! 🌍
📅 Enter schedule time: 2025-07-24 15:30:00
```

**Method 2: Edit tweets.json**
```json
[
  {
    "id": 1721780520000,
    "content": "Hello world! 🌍 #nodejs",
    "scheduleTime": "2025-07-24 15:30:00",
    "posted": false,
    "imagePath": "./images/photo.jpg"
  }
]
```

## Image Support

```bash
# 1. Create images folder
mkdir images

# 2. Add image to tweet
{
  "content": "Check this out! 📊",
  "scheduleTime": "2025-07-24 16:00:00",
  "imagePath": "./images/chart.png"
}
```

**Supported formats:** JPG, PNG, GIF, WebP (max 5MB)

## Features

- **Persistent Sessions** - Stays logged in, no repeated logins  
- **Human-like Behavior** - Random delays, realistic typing  
- **Stealth Mode** - Anti-detection measures  
- **Image Posting** - Upload photos with tweets  
- **Cron Scheduling** - Minute-level precision  
- **Error Recovery** - Handles failures gracefully  

## Troubleshooting

### Login Issues
```bash
# Delete saved session and retry
rm -rf chrome-profile
node index.js
```

### Selector Errors
- Twitter UI changes frequently
- Update selectors in `modules/twitterActions.js`
- Check screenshots in `./screenshots/` folder

### Common Fixes
```javascript
// Update these selectors when they break:
'[data-testid="tweetTextarea_0"]'     // Tweet compose area
'[data-testid="tweetButtonInline"]'   // Tweet button
'[name="text"]'                       // Username field
'[name="password"]'                   // Password field
```

## Maintenance

**Weekly:** Check if selectors still work  
**Monthly:** Update Puppeteer and dependencies  
**When broken:** Update selectors in twitterActions.js  

## Production Tips

```bash
# Run in background with PM2
npm install -g pm2
pm2 start index.js --name twitter-bot
pm2 save && pm2 startup
```

## Better Alternatives

- **Twitter API v2** - Free tier (1,500 tweets/month)
- **Buffer** - Free social media scheduler
- **Hootsuite** - Professional scheduling tool

---

**Last Updated:** July 2025  
**Status:** Working with Twitter UI as of July 2025  
**Next Update:** Required within 2-4 weeks due to UI changes