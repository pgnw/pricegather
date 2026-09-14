import {AldiAPIProduct} from "@/lib/scraping/aldi/types";
import {Prisma} from "@/generated/prisma/client";
import {prisma} from "@/lib/prisma";

export function TransformAldiAPIProduct(apiProduct: AldiAPIProduct, storeId: number): Prisma.ProductCreateManyInput {
    let grams = null;
    if (apiProduct.sellingSize != null) {
        const getGramsRegex = new RegExp("[0-9]*");
        const gramsStr = getGramsRegex.exec(apiProduct.sellingSize);
        grams = Number(gramsStr);
    }

    let price = 0;
    if (apiProduct.price?.amountRelevant != null) {
        price = Number(apiProduct.price?.amountRelevant) / 100;
    }

    const product = {
        id: apiProduct.sku,
        storeId: storeId,
        name: apiProduct.name,
        grams: grams,
        price: price,
    }



    return product;
}