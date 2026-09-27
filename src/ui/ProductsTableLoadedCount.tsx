import {Product} from "@/generated/prisma/client";
import {use} from "react";

export default function ProductsTableLoadedCount({productsPromise}: {productsPromise: Promise<Product[]>}) {
    const products = use (productsPromise);
    return (
        <p className="text-sm text-muted-foreground mb-1">
            {products.length} results
        </p>
    )

}