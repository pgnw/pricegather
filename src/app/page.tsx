import {getProducts} from "@/lib/data/products";
import Product_display from "@/ui/product_display";

export default async function page() {
    const productsPromise = getProducts();

    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
            <Product_display productsPromise={productsPromise}/>

        </main>
    );
}