'use client';
import {Product} from "@/generated/prisma/client";
import {use} from "react";
import {OramaProduct} from "@/lib/Orama";


export default function ProductsTable({productsPromise}: { productsPromise: Promise<OramaProduct[]> | OramaProduct[] }) {
    let products: OramaProduct[] = [];
    if (productsPromise instanceof Promise)
        products = use(productsPromise);
    else
        products = productsPromise;

    return (
        <>
            {products.map((product) => (
                <div key={product.productId} className={'flex flex-col border border-gray-400 rounded-md mt-2  '}>
                    <div className={'block'}>
                        <label>Name: {product.name}</label>
                    </div>
                    <div className={'block'}>
                        <label>Description: {product.description}</label>
                    </div>
                    <div className={'block'}>
                        <label>Cost: ${product.price.toString()}</label>
                    </div>
                    <div className={'block'}>
                        <label>Grams: {product.grams}</label>
                    </div>
                </div>
            ))}
        </>);
}
