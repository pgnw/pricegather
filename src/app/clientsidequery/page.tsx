'use server'
import AddUser from "@/ui/AddUser";
import {Suspense} from "react";
import Users from "@/ui/Users";
import Product_display from "@/app/clientsidequery/product_display";

import {OramaProduct, ProductPrismaToOrama} from "@/lib/Orama";
import {getProducts} from "@/lib/data/products";

export default async function page() {
    const data = getProducts();

    return (
        <Product_display data={data} />
    );
}
