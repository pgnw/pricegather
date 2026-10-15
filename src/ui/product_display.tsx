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
import {ProductWithMeasurement} from "@/lib/data/products";
import {Slider} from "@/components/ui/slider";

export default function ProductDisplay({
                                           productsPromise
                                       }: {
    productsPromise: Promise<ProductWithMeasurement[]>
}) {
    const [searchOptions, setSearchOptions] =
        useState<SearchOptions>({
            searchTerm: "",
            sortBy: "name",
            sortDirection: "DESC",
            minPrice: undefined,
            maxPrice: undefined,
            minWeight: undefined,
            maxWeight: undefined,
        });
    const [returnedProductsCount, setReturnedProductsCount] = useState(0);


    return (
        <main className="mx-auto w-full h-full max-w-5xl px-4 py-10 font-sans">

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

            <section className="rounded-md border bg-background p-5">
                <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchOptions.searchTerm ?? ""}
                    onChange={(e) =>
                        setSearchOptions(prev => ({
                            ...prev,
                            searchTerm: e.target.value,
                        }))
                    }
                    className="mb-6"
                />

                <div className="flex gap-5 sm:flex-row">
                    <fieldset>
                        <legend className="mb-2 text-xs font-medium text-muted-foreground">
                            Price
                        </legend>

                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="$ Min"
                                className="min-w-0 max-w-32"
                                value={searchOptions.minPrice ?? ""}
                                onChange={(e) =>
                                    setSearchOptions(prev => ({
                                        ...prev,
                                        minPrice:
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                    }))
                                }
                            />

                            <Input
                                type="number"
                                placeholder="$ Max"
                                className="min-w-0 max-w-32"
                                value={searchOptions.maxPrice ?? ""}
                                onChange={(e) =>
                                    setSearchOptions(prev => ({
                                        ...prev,
                                        maxPrice:
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="mb-2 text-xs font-medium text-muted-foreground">
                            Weight (grams)
                        </legend>

                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                className="min-w-0 max-w-32"
                                value={searchOptions.minWeight ?? ""}
                                onChange={(e) =>
                                    setSearchOptions(prev => ({
                                        ...prev,
                                        minWeight:
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                    }))
                                }
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                className="min-w-0 max-w-32"
                                value={searchOptions.maxWeight ?? ""}
                                onChange={(e) =>
                                    setSearchOptions(prev => ({
                                        ...prev,
                                        maxWeight:
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </fieldset>
                </div>
            </section>

            <section className="mt-6">
                <h2 className=" text-xl font-semibold tracking-tight mb-2 ">
                    Products
                </h2>

                {/*<Suspense fallback={<ProductsTableLoadedCountLoading/>}>*/}
                {/*    <ProductsTableLoadedCount count={returnedProductsCount}/>*/}
                {/*</Suspense>*/}

                <ProductsTableHeader searchOptions={searchOptions} setSearchOptions={setSearchOptions}/>

                <Suspense fallback={<ProductsTableBodyLoading/>}>
                    <ProductsTableBody productsPromise={productsPromise} searchOptions={searchOptions}
                                       onCountChange={setReturnedProductsCount}/>
                </Suspense>

            </section>

        </main>
    );
}