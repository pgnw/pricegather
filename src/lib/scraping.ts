const { chromium } = require('patchright');

export async function scrape()
{
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ozbargain.com.au/');
    // other actions...
    await browser.close();
}