import { chromium } from "patchright";

export async function scrapeColes() {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.coles.com.au/');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
}
