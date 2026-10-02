import {chromium} from "patchright";
import {gql, request} from "graphql-request";

export async function scrapeColes() {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

    const res = await page.goto('https://www.coles.com.au/', {waitUntil: "domcontentloaded"});
    if (res == null)
        throw new Error("Coles failed to load.");

    // Wait for next data to appear incase there are redirects.
    const locator = page.locator('script#__NEXT_DATA__');
    await locator.waitFor({state: "attached"});

    const runtimeConfigScript = page.locator("script")
        .filter({hasText: "__RUNTIME_CONFIG__"})
        .first()

    // Get a subscription key so we can access the products api.
    const subscriptionKey: string = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script');
        let key: string = "";
        scripts.forEach(script => {
            if (script.textContent && script.textContent.includes('__RUNTIME_CONFIG__')) {
                const regex = new RegExp('"BFF_API_SUBSCRIPTION_KEY":"([^"]*)"',);
                const match = regex.exec(script.textContent);
                if (match != null)
                    key = match[1];
            }
        });
        return key;
    })

    const query = gql`
    query GetShopProductsMenu($storeId: BrandedId!, $withCampaignLinks: Boolean!, $campaignCount: Int) {
        menuItems: productCategories(
            storeId: $storeId
            withCampaignLinks: $withCampaignLinks
            campaignCount: $campaignCount
        ) {
            ...shopProductsMenuFields
        }
    }`

    const storeId = 'COL:0584';

    await request('https://www.coles.com.au/api/graphql', query)
    await browser.close();
    console.log('done');
}