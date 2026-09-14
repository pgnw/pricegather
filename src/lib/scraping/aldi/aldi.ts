import ky from "ky";
import {AldiAPIResponse} from "@/lib/scraping/aldi/types";
import {TransformAldiAPIProduct} from "@/lib/scraping/aldi/transform";
import {prisma} from "@/lib/prisma";
import assert from "node:assert";
import PrismaPromise = Prisma.PrismaPromise;
import {BatchPayload} from "@/generated/prisma/internal/prismaNamespace";
import {Prisma} from "@/generated/prisma/client";

const pageSize = 60;

export async function scrapeAldi() {
    const aldiStoreId = (await prisma.store.findUnique({
        where: {
            name: "Aldi"
        }
    }))?.id;
    assert.ok(aldiStoreId);
    const deleteAldiProductsPromise = prisma.product.deleteMany({
        where: {
            storeId: aldiStoreId
        }
    });

    let res = await getAldiProducts(0);

    const totalCount = res.meta.pagination.totalCount;

    let products = res.data;
    let offset = pageSize;

    let dbProducts = products.map(apiProduct => {
        return TransformAldiAPIProduct(apiProduct, aldiStoreId);
    });

    const batchInsertPromises: PrismaPromise<BatchPayload>[] = [];

    // Wait for delete to finalise before adding new products in
    await deleteAldiProductsPromise;
    // Add the first batch of products
    batchInsertPromises.push(prisma.product.createMany({data: dbProducts}));

    let productsReturned = true;
    while (productsReturned && offset < totalCount) {
        // Wait here to avoid spamming the API
        res = await getAldiProducts(offset);
        products = res.data;
        productsReturned = products.length > 0;

        offset += pageSize;

        dbProducts = products.map(apiProduct => {
            return TransformAldiAPIProduct(apiProduct, aldiStoreId);
        });
        batchInsertPromises.push(prisma.product.createMany({data: dbProducts}));
    }
    await Promise.all(batchInsertPromises);
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