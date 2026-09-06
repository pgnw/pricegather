const {chromium} = require('patchright');

export async function scrape() {
    const browser = await chromium.launch({headless : false});
    const page = await browser.newPage();
    await page.goto('https://www.woolworths.com.au/');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
}

async function seedStoreInformation()
{
    
}