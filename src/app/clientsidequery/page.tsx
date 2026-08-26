'use client';
import {Suspense} from "react";
import ProductTable from "@/ui/ProductsTable";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";
import {Product} from "@/generated/prisma/client";


export default function Page() {
    const {data, error, isLoading} = useSWR<Product[]>('/api/', fetcher);

    if (error) {
        return (<>
            <div>its over</div>
            <div>{error}</div>
        </>);
    } else if (isLoading) {
        return (<>
            <div>LOADING</div>
        </>);
    }

    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <div className={'flex flex-col flex-1  mt-4 bg-gray-200 p-4 w-full'}>
                    {data?.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </div>

            </div>
        </main>
    );
}
