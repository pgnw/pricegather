import {getProducts} from "@/lib/actions";

export async function GET(request: Request) {

    const productsData = await getProducts();
    const productsJson = productsData;
    return new Response("hello");
 //   return new Response(await JSON.stringify(productsData));
}