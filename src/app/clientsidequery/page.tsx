'use client';
import {Fragment, Suspense, useEffect, useMemo, useRef, useState} from "react";
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
    const [data, setData] = useState<Product[]>([]);
    const [displayProducts, setDisplayProducts] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/");
            const json = await res.json();

            setData(json);
        }

        load();
    }, []);


    const db = useMemo(() => {
        console.log('Initializing db.')

        const oramaDb = create({
            schema: OramaProductSchema,
        });

        data?.forEach(product => {
            insert(oramaDb, ProductPrismaToOrama(product));
        });
        return oramaDb;
    }, [data]);


    // const products = useMemo(() => {
    //     console.log('Searching Orama db...');
    //     if (db == undefined) {
    //         console.error('No Orama db found');
    //         return [];
    //     }
    //     const result = search(db, {
    //         term: searchTerm,
    //         limit: 5000,
    //     });
    //
    //     const syncResult = result as Exclude<
    //         typeof result,
    //         Promise<unknown>>;
    //     return syncResult.hits.map(hit => hit.document);
    // }, [db, searchTerm]);

    useEffect(() => {
        const a = async () => {
            console.log('Searching Orama db...');
            if (db == undefined) {
                console.error('No Orama db found');
                return [];
            }
            const result = search(db, {
                term: searchTerm,
                limit: 10000,
            });

            setDisplayProducts((await result).hits.map(hit => hit.document));
        };
        a();
    }, [db, searchTerm]);


    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <input className={'border black rounded-md m-2'} id='txtSearch'
                       onChange={(e) => setSearchTerm(e.target.value)}
                       tabIndex={1}/>
                <div className={'bg-gray-200 w-full px-2 mt-2 rounded-md'}>
                    {displayProducts.length == 0 && <div className='w-full text-center h-500' >loading...</div>}
                    <ProductTable productsPromise={displayProducts}/>
                </div>
            </div>
        </main>
    );
}
