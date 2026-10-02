import {Product} from "@/generated/prisma/client";
import {volumeMeasurementType, weightMeasurementType, woolworthsStoreId} from "@/lib/data/staticData";
import {WhoolworthsApiProduct} from "@/lib/scraping/woolworths/woolworths";


export function transformWhoolworthsAPIProduct(apiProduct: WhoolworthsApiProduct): Product {
    let grams = null;
    let measurementTypeId = null;
    if (apiProduct.PackageSize != null && apiProduct.PackageSize !== "each") {
        const regex = new RegExp("([0-9]*)(.*)");
        const result = regex.exec(apiProduct.PackageSize);
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
        id: 'w_' + apiProduct.Stockcode.toString(),
        storeId: woolworthsStoreId,
        name: apiProduct.Name,
        grams: grams,
        price: (apiProduct.Price  ?? 0) * 1000,
        url: 'https://www.woolworths.com.au/shop/productdetails/' + apiProduct.Stockcode,
        measurementTypeId: measurementTypeId,
    } as Product;

    return product;
}