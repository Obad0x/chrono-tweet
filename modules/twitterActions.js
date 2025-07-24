const BrowserManager = require('./browserManager');
const fs = require('fs');

class TwitterActions extends BrowserManager {
  constructor() {
    super();
    this.isLoggedIn = false;
  }

  async login() {
    console.log('🔑 Logging into Twitter...');
    
    if (!this.page) {
      await this.createPage();
    }

    try {
      await this.page.goto('https://twitter.com/login', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Enter username
      await this.waitForElement('[name="text"]');
      await this.humanType(this.page, '[name="text"]', process.env.TWITTER_USERNAME);
      
      // Click Next button
      await this.clickButtonByText('Next');
      await this.randomDelay(2000, 4000);

      // Enter password
      await this.waitForElement('[name="password"]');
      await this.humanType(this.page, '[name="password"]', process.env.TWITTER_PASSWORD);
      
      // Click Login button
      await this.clickButtonByText('Log in');

      // Wait for home page
      await this.waitForElement('[data-testid="tweetTextarea_0"]', 15000);
      
      this.isLoggedIn = true;
      console.log('✅ Successfully logged in');
      
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      await this.takeScreenshot('login-error');
      throw error;
    }
  }

  async clickButtonByText(buttonText) {
    try {
      await this.page.evaluate((text) => {
        const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
        const button = buttons.find(btn => 
          btn.textContent.includes(text) || 
          btn.innerText.includes(text)
        );
        if (button) {
          button.click();
          return true;
        }
        return false;
      }, buttonText);
      
      await this.randomDelay(1000, 2000);
    } catch (error) {
      console.warn(`⚠️ Could not find button: ${buttonText}`);
      throw error;
    }
  }

  async composeTweet(content) {
    console.log('✍️ Composing tweet...');
    
    try {
      // Click tweet textarea
      await this.waitForElement('[data-testid="tweetTextarea_0"]');
      await this.page.click('[data-testid="tweetTextarea_0"]');
      
      // Type content with human-like delays
      await this.humanType(this.page, '[data-testid="tweetTextarea_0"]', content, 80);
      
      await this.randomDelay(1000, 3000);
      console.log('✅ Tweet composed');
      
    } catch (error) {
      console.error('❌ Failed to compose tweet:', error.message);
      await this.takeScreenshot('compose-error');
      throw error;
    }
  }

  async uploadImage(imagePath) {
    if (!imagePath || !fs.existsSync(imagePath)) {
      console.warn('⚠️ Image not found:', imagePath);
      return false;
    }

    try {
      console.log('🖼️ Uploading image...');
      
      // Click attachments button
      await this.page.click('[data-testid="attachments"]');
      await this.randomDelay(500, 1000);
      
      // Upload file
      const fileInput = await this.page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.uploadFile(imagePath);
        
        // Wait for upload confirmation
        await this.waitForElement('[data-testid="removeMedia"]', 10000);
        console.log('✅ Image uploaded successfully');
        
        await this.randomDelay(2000, 4000);
        return true;
      }
      
    } catch (error) {
      console.warn('⚠️ Image upload failed:', error.message);
      return false;
    }
  }

  async publishTweet() {
    console.log('🚀 Publishing tweet...');
    
    try {
      // Click tweet button
      await this.page.click('[data-testid="tweetButtonInline"]');
      
      // Wait for success (tweet disappears from composer)
      await this.page.waitForFunction(
        () => !document.querySelector('[data-testid="tweetTextarea_0"]')?.value ||
              document.querySelector('[data-testid="tweetTextarea_0"]')?.value === '',
        { timeout: 10000 }
      );
      
      console.log('✅ Tweet published successfully!');
      await this.randomDelay(2000, 4000);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to publish tweet:', error.message);
      await this.takeScreenshot('publish-error');
      throw error;
    }
  }

  async postTweet(content, imagePath = null) {
    try {
      if (!this.isLoggedIn) {
        await this.login();
      }

      await this.composeTweet(content);
      
      if (imagePath) {
        await this.uploadImage(imagePath);
      }
      
      await this.publishTweet();
      
      return true;
      
    } catch (error) {
      console.error('❌ Post tweet failed:', error.message);
      return false;
    }
  }

  async logout() {
    if (this.page && this.isLoggedIn) {
      try {
        // Navigate to logout or close browser
        await this.closeBrowser();
        this.isLoggedIn = false;
        console.log('👋 Logged out');
      } catch (error) {
        console.warn('⚠️ Logout warning:', error.message);
      }
    }
  }
}

module.exports = TwitterActions;