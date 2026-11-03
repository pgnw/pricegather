import {chromium} from "patchright";
import {gql, request} from "graphql-request";
import {
    ColesCategory,
    ColesCategoryResponse, ColesProduct,
    ColesProductResponse
} from "@/lib/scraping/coles/types";
import ky from "ky";
import Bottleneck from "bottleneck";
import {cookies} from "next/headers";
import {populateStore} from "@/lib/data/products";
import {transformColesAPIProduct} from "@/lib/scraping/coles/transform";
import {colesStoreId} from "@/lib/data/staticData";

const storeId = 'COL:0584';
const userAgent = "Mozilla/5.0 ... Chrome/132.0.0.0 Safari/537.36";

let buildId: string;
let subscriptionKey: string;
let cookieHeader: string;

export async function scrapeColes() {
    await setup();

    const categories = (await getCategories(subscriptionKey)).menuItems.items;
    const totalProducts: ColesProduct[] = [];

    // Import categories one at a time to avoid usage limits.
    const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 2500,
    });

    for (const category of categories) {
        const products = await limiter.schedule(() => {
                return getProducts(category)
            }
        );
        totalProducts.push(...products);
    }


    const totalProductsMap = new Map(totalProducts.map(p => [p.id, p]));

    const aa = 'a';

    const products = totalProducts.map(p => transformColesAPIProduct(p));

    await populateStore(colesStoreId,products);

}

async function setup() {
    const maxErrors = 10;
    let currentErrorCount = 0;
    let finished = false

    while (!finished && currentErrorCount < maxErrors) {

        // Load into the Coles web page, so that we can get the subscription key and the buildId, needed for pulling product data.
        const browser = await chromium.launch({headless: false});
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            const res = await page.goto('https://www.coles.com.au/', {waitUntil: "domcontentloaded"});
            if (res == null)
                throw new Error("Coles failed to load.");

            // Wait for next data to appear incase there are redirects.
            const locator = page.locator('script#__NEXT_DATA__');
            await locator.waitFor({state: "attached"});

            // Load the script with the buildId
            const nextDataText = await locator.textContent();
            if (nextDataText == null)
                throw new Error("Coles __NEXT_DATA__ script is empty.");

            const nextData = JSON.parse(nextDataText) as { buildId?: unknown };
            if (typeof nextData.buildId !== "string" || nextData.buildId.length === 0)
                throw new Error("Coles __NEXT_DATA__ is missing a buildId.");

            buildId = nextData.buildId;

            const cookies = await context.cookies();

            cookieHeader = cookies
                .map(cookie => `${cookie.name}=${cookie.value}`)
                .join("; ");


            // Get a subscription key so we can access the products json.
            subscriptionKey = await page.evaluate(() => {
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

            finished = true;
        } catch (err) {
            currentErrorCount++;
        } finally {
            await browser.close();
        }

    }

    if (currentErrorCount > maxErrors) {
        throw (new Error(`Error setting up Coles scraper.`));
    }
}

async function getProducts(
    category: ColesCategory
) {
    const products: ColesProduct[] = [];
    const url = `https://www.coles.com.au/_next/data/${buildId}/en/browse/${category.seoToken}.json`;
    const headers = {
        "ocp-apim-subscription-key": subscriptionKey,
        'user-agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'cookie': cookieHeader,
    };

    let page = 1;
    let prevProductsCount = 0;

    const maxErrors = 10;
    let currentErrorCount = 0;

    let breakLoop = false;

    while (!breakLoop) {
        let response = await ky
            .get(
                url,
                {
                    searchParams: {
                        page: page,
                    },
                    headers: headers,

                }
            );

        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
            prevProductsCount = products.length;

            products.push(...(await response.json<ColesProductResponse>()).pageProps.searchResults.results);
            page++;
        } else
            currentErrorCount++;

        breakLoop = currentErrorCount >= maxErrors || prevProductsCount > products.length;
    }

    return products;
}

async function getCategories(subscriptionKey: string): Promise<ColesCategoryResponse> {
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