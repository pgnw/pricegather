'use client';

import {
    Suspense,
    use,
    useMemo,
    useState
} from "react";

import {Product} from "@/generated/prisma/client";
import {create, insert, search} from "@orama/orama";
import {useWindowVirtualizer} from "@tanstack/react-virtual";

import {
    compareNullableNumber,
    OramaProductSchema,
    ProductPrismaToOrama,
    SearchOptions
} from "@/lib/Orama";

import ProductsLoading from "@/ui/ProductsLoading";
import {Input} from "@/components/ui/input";
import {
    ToggleGroup,
    ToggleGroupItem
} from "@/components/ui/toggle-group";
import {cn} from "@/lib/utils";
import ProductsTableHeader from "@/ui/ProductsTableHeader";
import ProductsTableBody from "@/ui/ProductsTableBody";
import ProductsTableLoadedCount from "@/ui/ProductsTableLoadedCount";
import ProductsTableLoadedCountLoading from "@/ui/ProductsTableLoadingCountLoading";
import ProductsTableBodyLoading from "@/ui/ProductsTableBodyLoading";


export default function ProductDisplay({
                                           productsPromise
                                       }: {
    productsPromise: Promise<Product[]>
}) {
    const [searchOptions, setSearchOptions] =
        useState<SearchOptions>({
            searchTerm: "",
            sortBy: "name",
            sortDirection: "ASC"
        });
    const [returnedProductsCount, setReturnedProductsCount] = useState(0);


    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-10 font-sans">

            <header className="mb-8 max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Product Search
                </h1>

                <p className="mt-2 text-base text-muted-foreground">
                    Compare products from major Australian supermarkets.
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Search for what you need, then sort by name, price, weight, or price per 100g
                    to compare value.
                </p>
            </header>

            <section className="rounded-md border bg-background p-4">

                <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchOptions.searchTerm ?? ""}
                    onChange={(e) =>
                        setSearchOptions(prev => ({
                            ...prev,
                            searchTerm: e.target.value
                        }))
                    }
                    className="mb-5"
                />

                <div className="flex flex-col gap-5 sm:flex-row">

                    <fieldset>
                        <legend className="mb-2 text-xs font-medium text-muted-foreground">
                            Sort by
                        </legend>

                        <ToggleGroup
                            value={[searchOptions.sortBy ?? "name"]}
                            variant="outline"
                            className="justify-start"
                            onValueChange={(values) => {
                                const value = values[0];

                                if (!value)
                                    return;

                                setSearchOptions(prev => ({
                                    ...prev,
                                    sortBy: value as SearchOptions["sortBy"]
                                }));
                            }}>
                            <ToggleGroupItem value="name">
                                Name
                            </ToggleGroupItem>

                            <ToggleGroupItem value="price">
                                Price
                            </ToggleGroupItem>

                            <ToggleGroupItem value="grams">
                                Weight
                            </ToggleGroupItem>

                            <ToggleGroupItem value="priceWeightRatio">
                                $ / 100g
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </fieldset>


                    <fieldset>
                        <legend className="mb-2 text-xs font-medium text-muted-foreground">
                            Direction
                        </legend>

                        <ToggleGroup
                            value={[searchOptions.sortDirection ?? "ASC"]}
                            variant="outline"
                            onValueChange={(values) => {
                                const value = values[0];

                                if (!value)
                                    return;
                                setSearchOptions(prev => ({
                                    ...prev,
                                    sortDirection:
                                        value as SearchOptions["sortDirection"]
                                }));
                            }}>
                            <ToggleGroupItem value="ASC">
                                Ascending
                            </ToggleGroupItem>

                            <ToggleGroupItem value="DESC">
                                Descending
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </fieldset>

                </div>
            </section>


            <section className="mt-8">
                <h2 className="text-xl font-semibold tracking-tight mb-1 ">
                    Products
                </h2>

                {/*<Suspense fallback={<ProductsTableLoadedCountLoading/>}>*/}
                {/*    <ProductsTableLoadedCount count={returnedProductsCount}/>*/}
                {/*</Suspense>*/}

                <ProductsTableHeader/>

                <Suspense fallback={<ProductsTableBodyLoading/>}>
                    <ProductsTableBody productsPromise={productsPromise} searchOptions={searchOptions}
                                       onCountChange={setReturnedProductsCount}/>
                </Suspense>

            </section>

        </main>
    );
}