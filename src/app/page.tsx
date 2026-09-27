import {getProducts} from "@/lib/data/products";
import Product_display from "@/ui/product_display";

export default async function page() {
    const productsPromise = getProducts();
    return (
        // TODO ADD COMPRESSION HERE
        <Product_display productsPromise={productsPromise}/>
    );
}