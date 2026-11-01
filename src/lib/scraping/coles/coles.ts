import {chromium} from "patchright";
import {gql, request} from "graphql-request";

const storeId = 'COL:0584';
const userAgent = "Mozilla/5.0 ... Chrome/132.0.0.0 Safari/537.36";

export async function scrapeColes() {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

    const res = await page.goto('https://www.coles.com.au/', {waitUntil: "domcontentloaded"});
    if (res == null)
        throw new Error("Coles failed to load.");

    // Wait for next data to appear incase there are redirects.
    const locator = page.locator('script#__NEXT_DATA__');
    await locator.waitFor({state: "attached"});

    const nextDataText = await locator.textContent();
    if (nextDataText == null)
        throw new Error("Coles __NEXT_DATA__ script is empty.");

    const nextData = JSON.parse(nextDataText) as { buildId?: unknown };
    if (typeof nextData.buildId !== "string" || nextData.buildId.length === 0)
        throw new Error("Coles __NEXT_DATA__ is missing a buildId.");

    const buildId = nextData.buildId;

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

    await browser.close();


    const r = await getCategories(subscriptionKey);

    console.log('done');
}

async function getCategories(subscriptionKey: string) {
    // Coles does not make the Graphql schema public
    // noinspection GraphQLUnresolvedReference
    const query = gql`
        query GetShopProductsMenu($storeId: BrandedId!, $withCampaignLinks: Boolean!, $campaignCount: Int) {
            menuItems: productCategories(
                storeId: $storeId
                withCampaignLinks: $withCampaignLinks
                campaignCount: $campaignCount
            ) {
                ...shopProductsMenuFields
            }
        }

        fragment shopProductsMenuFields on ProductCategories {
            restrictedIds: excludedCategoryIds
            items: catalogGroupView {
                ...shopProductMenuItemFields
                childItems: catalogGroupView {
                    ...shopProductMenuItemFields
                    childItems: catalogGroupView {
                        ...shopProductMenuItemFields
                    }
                }
            }
        }

        fragment shopProductMenuItemFields on ProductCategory {
            ...catalogGroupFields
            type
        }

        fragment catalogGroupFields on ProductCategory {
            id
            level
            name
            originalName
            productCount
            seoToken
            type
            subType
        }`;

    return request(
        'https://www.coles.com.au/api/graphql',
        query,
        {
            storeId,
            withCampaignLinks: true,
            campaignCount: 0,
        },
        {'ocp-apim-subscription-key': subscriptionKey, 'User-Agent': userAgent}
    );
}