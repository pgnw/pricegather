import {getProductsCached} from "@/lib/actions";
import ProductsTable from "@/ui/ProductsTable";
import SearchBar from "@/ui/SearchBar";
import {Suspense} from "react";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import ProductsTableWithCache from "@/ui/ProductsTableWithCache";


export default async function Page(props:
                                   {
                                       searchParams?: Promise<{
                                           search?: string;
                                       }>;
                                   }) {
    const searchParams = (await props.searchParams)?.search || "";

    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <Suspense fallback={null}>
                <SearchBar></SearchBar>
            </Suspense>
            <Suspense key={searchParams} fallback={<ProductTableLoading/>}>
                <ProductsTableWithCache name={searchParams} />
            </Suspense>
        </main>
    );
}
