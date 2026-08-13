import AddUser from "@/ui/AddUser";
import {Suspense} from "react";
import Users from "@/ui/Users";
import Link from "next/link";
import {getProducts} from "@/lib/actions";
import ProductSearch from "@/ui/ProductSearch";
import ProductSearchLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";

export default async function Home() {
    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <div className={'flex flex-col flex-1  mt-4 bg-gray-200 p-4 w-full'}>
                    <Suspense fallback={null}>
                        <SearchBar></SearchBar>
                    </Suspense>
                    <Suspense fallback={<ProductSearchLoading/>}>
                        <ProductSearch/>
                    </Suspense>
                </div>

            </div>
        </main>
    );
}
