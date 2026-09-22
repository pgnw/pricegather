import {AldiAPIProduct} from "@/lib/scraping/aldi/types";
import {Prisma, Product} from "@/generated/prisma/client";
import {prisma} from "@/lib/prisma";

export function transformAldiAPIProduct(apiProduct: AldiAPIProduct, storeId: number): Product {
    let grams = null;
    if (apiProduct.sellingSize != null) {
        const regex = new RegExp("([0-9\.]*)\\s*(\\S.*)");
        const result = regex.exec(apiProduct.sellingSize);
        if (result != null) {
            const [, weightNumberStr, weightSymbol] = result;

            if (weightSymbol == "g" || weightSymbol == "ml") {
                grams = Number(weightNumberStr);
            } else if (weightSymbol == "kg" || weightSymbol == "L") {
                grams = Number(weightNumberStr) * 1000;
            }
        }
    }

    const product = {
        id: apiProduct.sku,
        storeId: storeId,
        name: apiProduct.name,
        grams: grams,
        price: apiProduct.price.amountRelevant
    } as Product;

    return product;
}