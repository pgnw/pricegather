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

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-10 font-sans">

            {/* Heading */}
            <header className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Product Search
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Search and compare grocery products.
                </p>
            </header>


            {/* Search controls */}
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

                    {/* Sort field */}
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
                            }}
                        >
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


                    {/* Direction */}
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
                            }}
                        >
                            <ToggleGroupItem value="ASC">
                                Low → High
                            </ToggleGroupItem>

                            <ToggleGroupItem value="DESC">
                                High → Low
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </fieldset>

                </div>
            </section>


            <section className="mt-8">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Products
                    </h2>

                <Suspense fallback={<ProductsLoading/>}>
                    <ProductsTable
                        productsPromise={productsPromise}
                        searchOptions={searchOptions}
                    />
                </Suspense>

            </section>

        </main>
    );
}


function ProductsTable({
                           searchOptions,
                           productsPromise
                       }: {
    searchOptions: SearchOptions,
    productsPromise: Promise<Product[]>
}) {
    const products = use(productsPromise);


    /*
     * Build Orama once when products change.
     */
    const db = useMemo(() => {

        const oramaDb = create({
            schema: OramaProductSchema
        });

        products.forEach(product => {
            insert(
                oramaDb,
                ProductPrismaToOrama(product)
            );
        });

        return oramaDb;

    }, [products]);


    const sortBy =
        searchOptions.sortBy ?? "name";

    const sortDirection =
        searchOptions.sortDirection ?? "ASC";


    const resultAsync = search(db, {
        term: searchOptions.searchTerm ?? "",
        limit: 10000,

        sortBy: (a, b) => {

            const productA = a[2];
            const productB = b[2];


            /*
             * Name needs string sorting.
             */
            if (sortBy === "name") {

                const comparison =
                    productA.name.localeCompare(
                        productB.name
                    );

                return sortDirection === "ASC"
                    ? comparison
                    : -comparison;
            }


            /*
             * Other sortable fields are numeric.
             */
            const aValue =
                productA[sortBy] as number;

            const bValue =
                productB[sortBy] as number;


            return compareNullableNumber(
                aValue,
                bValue,
                sortDirection
            );
        }
    });


    const result =
        resultAsync as Exclude<
            typeof resultAsync,
            Promise<unknown>
        >;


    const displayProducts =
        result.hits.map(hit => hit.document);


    const rowVirtualizer =
        useWindowVirtualizer({
            count: displayProducts.length,
            estimateSize: () => 68,
            measureElement: element =>
                element.getBoundingClientRect().height,
            overscan: 15
        });


    return (
        <>
            <p className="text-sm text-muted-foreground mb-1">
                {displayProducts.length} results
            </p>
            <div
                className={cn(
                    "grid",
                    "grid-cols-[minmax(300px,1fr)_120px_120px_120px]",
                    "gap-4 rounded-t-md border bg-muted/40",
                    "px-4 py-3 text-sm font-medium text-muted-foreground"
                )}
            >
                <span>Product</span>
                <span>Weight</span>
                <span>Price</span>
                <span>$ / 100g</span>
            </div>

            <div
                className="relative w-full border-x border-b"
                style={{
                    height:
                        `${rowVirtualizer.getTotalSize()}px`
                }}
            >
                {rowVirtualizer
                    .getVirtualItems()
                    .map((virtualRow) => {

                        const product =
                            displayProducts[
                                virtualRow.index
                                ];

                        return (
                            <div
                                key={product.productId}
                                ref={rowVirtualizer.measureElement}
                                data-index={virtualRow.index}
                                className={cn(
                                    "absolute left-0 top-0 grid w-full",
                                    "grid-cols-[minmax(300px,1fr)_120px_120px_120px]",
                                    "items-center gap-4 border-b bg-background",
                                    "px-4 py-3 text-sm hover:bg-muted/30"
                                )}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`
                                }}
                            >
                                <div className="min-w-0">
                                    <a
                                        href="da-link"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate font-medium hover:underline"
                                    >
                                        {product.name}
                                    </a>
                                </div>

                                <div className="text-muted-foreground">
                                    {product.grams > 0
                                        ? `${product.grams}g`
                                        : "—"}
                                </div>

                                <div className="font-medium">
                                    ${product.price.toFixed(2)}
                                </div>

                                <div className="text-muted-foreground">
                                    {product.priceWeightRatio > 0
                                        ? `$${product.priceWeightRatio.toFixed(2)}`
                                        : "—"}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}