import ky from "ky";
import {AldiAPIResponse} from "@/lib/scraping/aldi/types";
import {transformAldiAPIProduct} from "@/lib/scraping/aldi/transform";
import {prisma} from "@/lib/prisma";
import assert from "node:assert";
import PrismaPromise = Prisma.PrismaPromise;
import {BatchPayload} from "@/generated/prisma/internal/prismaNamespace";
import {Prisma} from "@/generated/prisma/client";
import {populateStore} from "@/lib/data/products";

const pageSize = 60;

export async function scrapeAldi() {
    const aldiStoreId = (await prisma.store.findUnique({
        where: {
            name: "Aldi"
        }
    }))?.id;
    assert.ok(aldiStoreId);

    let res = await getAldiProducts(0);

    const products = res.data.map(apiProduct => {
        return transformAldiAPIProduct(apiProduct, aldiStoreId);
    });

    const totalCount = res.meta.pagination.totalCount;
    let offset = pageSize;

    let wereProductsReturned = true;
    while (wereProductsReturned && offset < totalCount) {
        // Wait here to avoid spamming the API
        res = await getAldiProducts(offset);

        wereProductsReturned = res.data.length > 0;
        offset += pageSize;

        const returnedProducts = res.data.map(apiProduct => {
            return transformAldiAPIProduct(apiProduct, aldiStoreId);
        });
        products.push(...returnedProducts);
    }

    await populateStore(aldiStoreId,products);
}

async function getAldiProducts(offset: number): Promise<AldiAPIResponse> {
    const apiURL = 'https://api.aldi.com.au/v3/product-search';
    const currency = 'AUD';
    const serviceType = 'walk-in';
    const servicePoint = 'G452';

    const fullURL = `${apiURL}?currency=${currency}&serviceType=${serviceType}&limit=${pageSize}&offset=${offset}&servicePoint=${servicePoint}`;
    const fetchObj = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:155.0) Gecko/20100101 Firefox/155.0',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
        }
    }
    return ky.get<AldiAPIResponse>(fullURL, fetchObj).json();
}