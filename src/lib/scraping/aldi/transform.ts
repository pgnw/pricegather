import {AldiAPIProduct} from "@/lib/scraping/aldi/types";
import {Prisma} from "@/generated/prisma/client";
import {prisma} from "@/lib/prisma";

export function TransformAldiAPIProduct(apiProduct: AldiAPIProduct, storeId: number): Prisma.ProductCreateManyInput {
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

    let price: Prisma.Decimal = Prisma.Decimal(0);
    if (apiProduct.price?.amountRelevant != null) {
        price = Prisma.Decimal(apiProduct.price?.amountRelevant).div(Prisma.Decimal(100));
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