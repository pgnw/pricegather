'use server'
import AddUser from "@/ui/AddUser";
import {Suspense} from "react";
import Users from "@/ui/Users";
import Product_display from "@/app/clientsidequery/product_display";
import {getProducts} from "@/lib/actions";
import {OramaProduct, ProductPrismaToOrama} from "@/lib/Orama";

export default async function page() {
    const data =  await getProducts();

    const prods = data.map((p) => ProductPrismaToOrama(p));
    return (
        <Product_display data={prods} />
    );
}
