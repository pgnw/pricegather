import {prisma} from "@/lib/prisma";
import assert from "node:assert";
import {populateStore} from "@/lib/data/products";
import ky from "ky";
import {AldiAPIResponse} from "@/lib/scraping/aldi/types";
import {Agent} from "node:http";
import {woolworthsStoreId} from "@/lib/data/staticData";
import {transformWhoolworthsAPIProduct} from "@/lib/scraping/woolworths/transform";
import {Product} from "@/generated/prisma/client";
import {chromium} from "patchright";
import makeFetchCookie from 'fetch-cookie'

export async function scrapeWoolworths() {
    const categories = await getCategories();

    // Woolworths categories have some duplicate products
    const totalProducts = new Map<string, Product>();

    const millisecondsBetweenRequests = 1000;
    const miniumWaitTime = () => new Promise(resolve => setTimeout(resolve, millisecondsBetweenRequests));

    for (const category of categories) {
        const delay = miniumWaitTime();
        const productsResponse = await getProductsFromCategory(category);

        if (productsResponse.Bundles == null)
            continue;

        for (const bundle of productsResponse.Bundles) {
            for (const apiProduct of bundle.Products) {
                const sourceCategories = apiProduct.AdditionalAttributes.piesdepartmentnamesjson;

                // Skip products which come from third party sellers
                if (sourceCategories.includes('Everyday') || sourceCategories.includes('Healthylife') ) {
                    continue;
                }

                const product = transformWhoolworthsAPIProduct(apiProduct);
                totalProducts.set(product.id, product);

            }
        }
        // Only send requests once every x milliseconds to avoid getting banned.
        await delay;
    }

    await populateStore(woolworthsStoreId, totalProducts.values().toArray());
}


async function getCategories(): Promise<Category[]> {
    const apiURL = 'https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials';

    let categories = await kyFetchWithCookies.get<ApiCategories>(apiURL).json();

    // Only return non restricted categories, also ignore third party sellers
    return categories.Categories.filter(c => !c.IsRestricted && c.Description != 'Everyday Market' && c.Description != 'HealthyLife');
}

async function getProductsFromCategory(category: Category) {
    const formatObject = `{\"name\":\"${category.Description}\"}`;
    const body = {
        categoryId: category.NodeId,
        pageNumber: 1,
        pageSize: 36,
        url: 'a', // Seems to accept anything?
        formatObject: formatObject,
    };
    const url = 'https://www.woolworths.com.au/apis/ui/browse/category';

    const products = kyFetchWithCookies.post<ApiProductsFromCategory>(url, {json: body}).json();

    return products;
}

const kyFetchWithCookies = ky.create({
    fetch: makeFetchCookie(fetch),

    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",

        Origin: "https://www.woolworths.com.au",

        Referer:
            "https://www.woolworths.com.au/shop/browse/fruit-veg",

        Accept: "application/json",
    },

    retry: {
        limit: 10,
        statusCodes: [403, 503],
    },
});


type ApiCategories = {
    Categories: [
        Category,
    ]
}

type Category = {
    NodeId: string,
    UrlFriendlyName: string,
    Description: string,
    IsRestricted: boolean,
}

type ApiProductsFromCategory = {
    Bundles: [ApiBundle],
}

type ApiBundle = {
    Products: [WhoolworthsApiProduct]
}

export type WhoolworthsApiProduct = {
    Stockcode: number,
    Price: number,
    Name: string,
    UrlFriendlyName: string,
    PackageSize: string,
    Vendor: string,
    AdditionalAttributes: {
        piesdepartmentnamesjson: string,
    }
};
