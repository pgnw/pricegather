'use client';
import {Suspense, useEffect, useState} from "react";
import ProductTable from "@/ui/ProductsTable";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";
import {Product} from "@/generated/prisma/client";
import {create, search, insert} from "@orama/orama";
import {Decimal} from "@prisma/client/runtime/client";
import {useSearchParams} from "next/navigation";
import * as sea from "node:sea";

import {OramaProduct, ProductPrismaToOrama} from '@/lib/Orama';

export default function Page() {
    const refreshTime = new Date();
    refreshTime.setSeconds(refreshTime.getSeconds() + 5);

    // USE EFFECT GO HERE

    const {data, error, isLoading} = useSWR<Product[]>('/api', fetcher, {
        refreshInterval: () => {
            const now = new Date();
            const midnightTime = new Date(now);
            midnightTime.setHours(24, 0, 0, 0);

            const nextRefesh = midnightTime.getTime() - now.getTime() + 10000;
            console.log(`${nextRefesh} milliseconds until refresh`);
            return nextRefesh;
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: false,
    });
    if (error) {
        return (<>
            <div>its over</div>
            <div>{error.message}</div>
        </>);
    } else if (isLoading) {
        return (<>
            <div>LOADING</div>
        </>);
    } else {
        setProducts ( data?.map(p => {
            return ProductPrismaToOrama(p);
        }) ?? []);
    }

    const db = create({
        schema: {
            id: "number",
            name: "string",
            description: "string",
            price: "number",
            grams: "number"
        },
    });

    products.map(product => {
        insert(db, {
            name: product.name,
            description: product.description,
            grams: product.grams,
            price: new Decimal(product.price).toNumber(),
        });
    })

    async function runSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const queryStr = e.target.value;
        const searchResult = await search(db, {term: queryStr});
        setProducts(searchResult.hits.map(h => {
            return h.document;
        }));
        console.log(queryStr);
        products.forEach(p => {
            console.log(p.name);
        });
    }

    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <input className={'border black rounded-md m-2'} id='txtSearch' onChange={runSearch} tabIndex={1}/>
                <div className={'flex flex-col flex-1  mb-4 bg-gray-200 p-4 w-full'}>
                    {products.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </div>

            </div>
        </main>
    );
}
