'use client';
import {Fragment, Suspense, use, useEffect, useMemo, useRef, useState} from "react";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";
import {Product} from "@/generated/prisma/client";
import {create, insert, Orama, Results, search} from "@orama/orama"
import {useSearchParams} from "next/navigation";
import * as sea from "node:sea";

import {OramaProduct, OramaProductSchema, ProductPrismaToOrama} from '@/lib/Orama';
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import ProductsLoading from "@/app/clientsidequery/ProductsLoading";

export default function Product_display({productsPromise}: { productsPromise: Promise<Product[]> }) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <input className={'border black rounded-md m-2'} id='txtSearch'
                       onChange={(e) => setSearchTerm(e.target.value)}
                       tabIndex={1}/>
                <div className={'bg-gray-200 w-full px-2 mt-2 rounded-md'}>
                    <Suspense fallback={<ProductsLoading/>}>
                        <ProductsTable productsPromise={productsPromise} searchTerm={searchTerm}/>
                    </Suspense>
                </div>
            </div>
        </main>
    );
}

function ProductsTable({searchTerm, productsPromise}:
                       { searchTerm: string, productsPromise: Promise<Product[]> }) {
    const products = use(productsPromise);

    const dbRenderCount = useRef(0);

    const db = useMemo(() => {
        console.log('Initializing db.')
        console.log(dbRenderCount.current);
        dbRenderCount.current++;

        const oramaDb = create({
            schema: OramaProductSchema,
        });

        products.forEach(product => {
            insert(oramaDb, ProductPrismaToOrama(product));
        });
        return oramaDb;
    }, [products]);


    const resultAsync = search(db, {
        term: searchTerm,
        limit: 10000,
    })
    const resultSync = resultAsync as Exclude<typeof resultAsync, Promise<unknown>>;

    const displayProducts = (resultSync.hits.map(hit => hit.document));

    const rowVirtualizer = useWindowVirtualizer({
        count: displayProducts.length,
        estimateSize: () => 120,
        measureElement: (element) => element.getBoundingClientRect().height,
        gap: 8,
        overscan: 15
    });

    return (
        <div style={{height: `${rowVirtualizer.getTotalSize() + 40}px`}} className={'w-full relative mt-2'}>
            {rowVirtualizer.getVirtualItems().map((v) => {
                const product = displayProducts[v.index];
                return (
                    <div key={product.productId}
                         className={'flex flex-col border border-gray-400 rounded-md absolute top-0 left-0 w-full'}
                         style={{transform: `translateY(${v.start}px)`}}
                         ref={rowVirtualizer.measureElement}
                         data-index={v.index}>
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
                        <div className={'block'}>
                            <label>Price weight ratio: ${product.priceWeightRatio}</label>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
