'use client';
import {Product} from "@/generated/prisma/client";
import {use} from "react";


export default function ProductsTable({productsPromise}: { productsPromise: Promise<Product[]> | Product[] }) {
    let products: Product[] = [];
    if (productsPromise instanceof Promise)
        products = use(productsPromise);
    else
        products = productsPromise;

    return (
        <>
            {products.map((product) => (
                <div key={product.id} className={'flex flex-col border border-gray-400 rounded-md mt-2  '}>
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
