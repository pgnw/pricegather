'use server'
import AddUser from "@/ui/AddUser";
import {Suspense} from "react";
import Users from "@/ui/Users";
import Product_display from "@/app/clientsidequery/product_display";

import {OramaProduct, ProductPrismaToOrama} from "@/lib/Orama";
import {getProducts} from "@/lib/data/products";
import products_loading from "@/app/clientsidequery/ProductsLoading";
import ProductsLoading from "@/app/clientsidequery/ProductsLoading";

export default async function page() {
    const productsPromise = getProducts();

    return (
        <Product_display productsPromise={productsPromise}/>
    );
}
