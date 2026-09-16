import {Suspense} from "react";
import ProductTable from "@/ui/ProductsTable";
import ProductTableLoading from "@/ui/ProductSearchLoading";
import SearchBar from "@/ui/SearchBar";
import {getProducts} from "@/lib/actions";

export default async function Page(props:
                                   {
                                       searchParams?: Promise<{
                                           search?: string;
                                       }>;
                                   }) {
    const searchTerm = (await props.searchParams)?.search || "";
    const products =  getProducts({name: searchTerm});
    console.log(searchTerm);
    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search</h1>
                <div className={'flex flex-col flex-1  mt-4 bg-gray-200 p-4 w-full'}>
                    <Suspense fallback={null}>
                        <SearchBar></SearchBar>
                    </Suspense>
                    <Suspense key={searchTerm} fallback={<ProductTableLoading/>}>
                        <ProductTable productsPromise={products}/>
                    </Suspense>
                </div>

            </div>
        </main>
    );
}
