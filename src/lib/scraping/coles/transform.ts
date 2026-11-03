import {Product} from "@/generated/prisma/client";
import {colesStoreId, volumeMeasurementType, weightMeasurementType, woolworthsStoreId} from "@/lib/data/staticData";
import {ColesProduct} from "@/lib/scraping/coles/types";


export function transformColesAPIProduct(apiProduct: ColesProduct): Product {
    let grams = null;
    let measurementTypeId = null;

    if (apiProduct.size != null) {
        const regex = new RegExp("([0-9]*)(.*)");
        const result = regex.exec(apiProduct.size);
        if (result != null) {
            const [, weightNumberStr, weightSymbol] = result;

            if (weightSymbol == "g" || weightSymbol == "KG") {
                measurementTypeId = weightMeasurementType?.id;
            } else if (weightSymbol == 'ml' || weightSymbol == 'L') {
                measurementTypeId = volumeMeasurementType?.id;
            }

            if (weightSymbol == "g" || weightSymbol == "ml") {
                grams = Number(weightNumberStr);
            } else if (weightSymbol == "KG" || weightSymbol == "L") {
                grams = Number(weightNumberStr) * 1000;
            }
        }
    }

    const product = {
        id: 'c_' + apiProduct.id,
        storeId: colesStoreId,
        name: apiProduct.name.slice(0, 65),
        grams: grams,
        price: apiProduct.pricing?.now ? apiProduct.pricing.now * 100 : null,
        url: 'https://www.coles.com.au/product/' + apiProduct.id,
        measurementTypeId: measurementTypeId,
    } as Product;

    return product;
}