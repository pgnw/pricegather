import {getProducts, getProductsWithMeasurementUnits} from "@/lib/data/products";
import Product_display from "@/ui/product_display";

export default async function page() {
    const productsPromise = getProductsWithMeasurementUnits();
    const a = await productsPromise;
    return (
        <Product_display productsPromise={productsPromise}/>
    );
}