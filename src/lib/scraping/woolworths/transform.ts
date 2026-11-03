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
            let [, weightNumberStr, weightSymbol] = result;

            weightSymbol = weightSymbol.toLowerCase();

            if (weightSymbol == "g" || weightSymbol == "kg") {
                measurementTypeId = weightMeasurementType?.id;
            } else if (weightSymbol == 'ml' || weightSymbol == 'l') {
                measurementTypeId = volumeMeasurementType?.id;
            }

            if (weightSymbol == "g" || weightSymbol == "ml") {
                grams = Number(weightNumberStr);
            } else if (weightSymbol == "kg" || weightSymbol == "l") {
                grams = Number(weightNumberStr) * 1000;
            }
        }
    }

    const product = {
        id: 'w_' + apiProduct.Stockcode.toString(),
        storeId: woolworthsStoreId,
        name: apiProduct.Name.slice(0, 65),
        grams: grams,
        price: apiProduct.Price ? apiProduct.Price * 100 : null,
        url: 'https://www.woolworths.com.au/shop/productdetails/' + apiProduct.Stockcode,
        measurementTypeId: measurementTypeId,
    } as Product;

    return product;
}