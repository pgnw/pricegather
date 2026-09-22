'use client';
import {Fragment, Suspense, use, useEffect, useMemo, useRef, useState} from "react";
import ProductTable from "@/ui/ProductsTable";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";
import {Product} from "@/generated/prisma/client";
import {create, insert, Orama, Results, search} from "@orama/orama"
import {useSearchParams} from "next/navigation";
import * as sea from "node:sea";

import {OramaProduct, OramaProductSchema, ProductPrismaToOrama} from '@/lib/Orama';

export default function Product_display(props: {data: Promise<Product[]>}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [displayProducts, setDisplayProducts] = useState<any[]>([]);

    const data =  use(props.data);

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

    useEffect(() => {
        const runSearch = async () => {
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
        runSearch();
    }, [db, searchTerm]);


    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <input className={'border black rounded-md m-2'} id='txtSearch'
                       onChange={(e) => setSearchTerm(e.target.value)}
                       tabIndex={1}/>
                <div className={'bg-gray-200 w-full px-2 mt-2 rounded-md'}>
                    <ProductTable productsPromise={displayProducts}/>
                </div>
            </div>
        </main>
    );
}
