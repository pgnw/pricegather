import {getProducts} from "@/lib/data/products";


export async function GET(request: Request) {
    const productsData = await getProducts();

    return new Response(JSON.stringify(productsData));
}