import {expect, test, vi} from "vitest";
import {scrapeAldi} from "@/lib/scraping/aldi/aldi";
import {prisma} from "@/lib/__mocks__/prisma";

import {transformAldiAPIProduct} from "@/lib/scraping/aldi/transform";
import {populateStore} from "@/lib/data/products";
import {mockAldiResponse} from "@/lib/__mocks__/handler";
import {Product} from "@/generated/prisma/client";

test("Transform Aldi product", async () => {
    const id = "000000000000173130";
    const name = "Mega Roulette 45g";
    const grams = 45;
    const sellingSize = `${grams} g`;
    const price = 99;

    const mockAPIProduct = {
        "sku": id,
        "name": name,
        "sellingSize": sellingSize,
        "price": {
            "amountRelevant": price,
            "comparison": price
        },
    };

    const storeId = 2;

    const returnedProduct = transformAldiAPIProduct(mockAPIProduct);

    const expectedReturnedProduct = {
        id: id,
        name: name,
        grams: grams,
        price: price,
        storeId: storeId,
    } as Product;

    expect(returnedProduct).toStrictEqual(expectedReturnedProduct);
})

test("Transform Aldi product with missing weight value", async () => {
    const id = "000000000000173130";
    const name = "Mega Roulette 45g";
    const grams = undefined;
    const sellingSize = `${grams} g`;
    const price = 99;

    const mockAPIProduct = {
        "sku": id,
        "name": name,
        "sellingSize": sellingSize,
        "price": {
            "amountRelevant": price,
            "comparison": price
        },
    };

    const storeId = 2;

    const returnedProduct = transformAldiAPIProduct(mockAPIProduct);

    const expectedReturnedProduct = {
        id: id,
        name: name,
        grams: null,
        price: price,
        storeId: storeId,
    } as Product;

    expect(returnedProduct).toStrictEqual(expectedReturnedProduct);
})