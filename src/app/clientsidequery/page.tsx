'use client';
import {Fragment, Suspense, useEffect, useState} from "react";
import ProductTable from "@/ui/ProductsTable";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";
import {Product} from "@/generated/prisma/client";
import {create, insert, Orama, Results, search} from "@orama/orama"
import {Decimal} from "@prisma/client/runtime/client";
import {useSearchParams} from "next/navigation";
import * as sea from "node:sea";

import {OramaProduct, OramaProductSchema, ProductPrismaToOrama} from '@/lib/Orama';

export default function Page() {
    const [searchTerm, setSearchTerm] = useState("");

    const refreshTime = new Date();
    refreshTime.setSeconds(refreshTime.getSeconds() + 5);

    const {data, error, isLoading} = useSWR<Product[]>('/api', fetcher, {
        refreshInterval: () => {
            const now = new Date();
            const midnightTime = new Date(now);
            midnightTime.setHours(24, 0, 0, 0);

            const nextRefesh = midnightTime.getTime() - now.getTime() + 10000;
            console.log(`${nextRefesh} milliseconds until refresh`);
            return nextRefesh;
        },
        keepPreviousData: true,
        //revalidateOnFocus: false,
        //revalidateOnReconnect: false,
        //revalidateOnMount: false,
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
    }
    let db: Orama<typeof OramaProductSchema>
    db = create({
        schema: OramaProductSchema,
    });

    data?.forEach(product => {
        insert(db, ProductPrismaToOrama(product));
    });

    const result = search(db, {term: searchTerm});

    const syncResult = result as Exclude<
        typeof result,
        Promise<unknown>
    >;

    const products = syncResult.hits.map(h => h.document);

    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <input className={'border black rounded-md m-2'} id='txtSearch'
                       onChange={(e) => setSearchTerm(e.target.value)}
                       tabIndex={1}/>
                <div className={'flex flex-col flex-1  mb-4 bg-gray-200 p-4 w-full'}>
                    <ol>
                        {products.map(product => {
                            console.log(product);
                            return <Fragment key={product.productId}>
                                <div>{product.name}</div>
                            </Fragment>
                        })}
                        {/*{products.map((item) => {*/}
                        {/*    <Fragment key={item.productId}>*/}
                        {/*        <li>{item.productId + item.name}</li>*/}
                        {/*    </Fragment>*/}
                        {/*))}*/}
                    </ol>
                </div>

            </div>
        </main>
    );
}
