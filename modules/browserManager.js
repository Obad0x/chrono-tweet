const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class BrowserManager {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async createBrowser() {
    console.log('🌐 Starting browser...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Change to true for production
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-blink-features=AutomationControlled'
      ],
      defaultViewport: null
    });

    return this.browser;
  }

  async createPage() {
    if (!this.browser) {
      await this.createBrowser();
    }

    this.page = await this.browser.newPage();
    
    // Set realistic browser properties
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );
    
    await this.page.setViewport({ 
      width: 1920, 
      height: 1080 
    });
    
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Remove webdriver property
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    console.log('📄 Page created successfully');
    return this.page;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser closed');
    }
  }

  async randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async humanType(page, selector, text, delay = 100) {
    await page.click(selector);
    
    for (const char of text) {
      await page.type(selector, char, { delay: Math.random() * delay + 50 });
    }
  }

  async waitForElement(selector, timeout = 10000) {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.waitForSelector(selector, { timeout });
  }

  async clickElement(selector) {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.click(selector);
  }

  async takeScreenshot(name = 'debug') {
    if (!this.page) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    
    try {
      await this.page.screenshot({ path: filename, fullPage: true });
      console.log(`📸 Screenshot saved: ${filename}`);
    } catch (error) {
      console.warn('⚠️ Screenshot failed:', error.message);
    }
  }
}

module.exports = BrowserManager;