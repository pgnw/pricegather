import {getProducts} from "@/lib/actions";

export async function GET(request: Request) {
    const productsData = await getProducts();

    return new Response(JSON.stringify(productsData));
}