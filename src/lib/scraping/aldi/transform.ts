import {AldiAPIProduct} from "@/lib/scraping/aldi/types";
import {Prisma, Product} from "@/generated/prisma/client";
import {prisma} from "@/lib/prisma";

const volumeMeasurementType = await prisma.measurementType.findUnique({
    where: {measurementType: 'volume'}
})!;
const weightMeasurementType = await prisma.measurementType.findUnique({
    where: {measurementType: 'weight'}
})!;


export function transformAldiAPIProduct(apiProduct: AldiAPIProduct, storeId: number): Product {
    let grams = null;
    let measurementTypeId = null;
    if (apiProduct.sellingSize != null) {
        const regex = new RegExp("([0-9\.]*)\\s*(\\S.*)");
        const result = regex.exec(apiProduct.sellingSize);
        if (result != null) {
            const [, weightNumberStr, weightSymbol] = result;

            if (weightSymbol == "g" || weightSymbol == "kg") {
                measurementTypeId = weightMeasurementType?.id;
            } else if (weightSymbol == 'ml' || weightSymbol == 'L') {
                measurementTypeId = volumeMeasurementType?.id;
            }

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
        price: apiProduct.price.amountRelevant,
        url: 'https://www.aldi.com.au/product/' + apiProduct.sku,
        measurementTypeId: measurementTypeId,
    } as Product;

    return product;
}