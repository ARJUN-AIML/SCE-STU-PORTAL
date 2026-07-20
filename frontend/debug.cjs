const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('Page error:', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });

  try {
    await page.goto('https://sce-stu-portal.vercel.app', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('Page loaded successfully');
  } catch (e) {
    console.log('Navigation error:', e.message);
  }
  
  await browser.close();
})();
