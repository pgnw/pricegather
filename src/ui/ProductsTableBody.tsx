import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {Product} from "@/generated/prisma/client";
import React, {use, useLayoutEffect, useMemo, useRef} from "react";
import {create, insert, search} from "@orama/orama";
import {
    compareNullableNumber, getWeightString,
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
import {ProductWithMeasurement} from "@/lib/data/products";
import {DisplayProduct} from "@/lib/types";

export default function ProductsTableBody({
                                              searchOptions,
                                              productsPromise,
                                              onCountChange,
                                          }: {
    searchOptions: SearchOptions,
    productsPromise: Promise<ProductWithMeasurement[]>,
    onCountChange: React.Dispatch<React.SetStateAction<number>>,
}) {
    'use no memo'; // Need this due to tanstack virtual breaking
    const containerRef = useRef<HTMLDivElement>(null);


    const products = use(productsPromise) as DisplayProduct[];

    for (const product of products) {
        // Products without weight will have their price weight ratio undefined so that they sit at the bottom when sorting using price weight ratio.
        if (product.grams && product.grams > 0)
            product.priceWeightRatio = (product.price / product.grams);

    }


    const sortBy =
        searchOptions.sortBy ?? "name";

    const sortDirection =
        searchOptions.sortDirection ?? "ASC";

    const displayProducts = useMemo(() => {
        let filteredProducts = products;

        filteredProducts = products.filter(product => {
            return !(product.price > (searchOptions.maxPrice ?? 1000000) * 100
                || product.price < (searchOptions.minPrice ?? 0) * 100
                || product.grams != null && product.grams > (searchOptions.maxWeight ?? Number.MAX_VALUE)
                || product.grams != null && product.grams < (searchOptions.minWeight ?? Number.MIN_VALUE));
        });

        if (searchOptions.searchTerm != '') {
            filteredProducts = filteredProducts.filter(product => {
                product.name.includes(searchOptions.searchTerm!)
            });
        }

        if (searchOptions.sortBy === 'priceWeightRatio' || searchOptions.sortBy === 'price' || searchOptions.sortBy === 'grams') {
            filteredProducts = filteredProducts.sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];
                let result = 0;

                if (aVal == null)
                    return 1;
                else if (bVal == null)
                    return -1;

                if (aVal < bVal)
                    result = -1;
                else if (aVal > bVal)
                    result = 1;
                else
                    return 0;

                if (sortDirection === "DESC")
                    return result;
                else
                    return result * -1;
            });

        } else if (searchOptions.sortBy === 'name') {
            filteredProducts = filteredProducts.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();

                let result = aName.localeCompare(bName);

                if (sortDirection === 'DESC')
                    return result;
                else
                    return result * -1;
            })
        }

        return filteredProducts;
    }, [searchOptions, products]);


    const rowVirtualizer =
        useWindowVirtualizer({
            count: displayProducts.length,
            estimateSize: () => 32,
            overscan: 50,
            getItemKey: (index) => displayProducts[index].id,
        });
    rowVirtualizer.shouldAdjustScrollPositionOnItemSizeChange = () => false;


    return (<>
        <div
            className="relative w-full border-x border-b"
            ref={containerRef}
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
                            key={product.id}
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
                                    href={product.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate font-medium hover:underline "
                                >
                                    {product.name}
                                </a>
                            </div>

                            <div className="text-muted-foreground">
                                {getWeightString(product)}
                            </div>

                            <div className="font-medium">
                                ${(product.price / 100).toFixed(2)}
                            </div>

                            <div className="text-muted-foreground">
                                {product.priceWeightRatio
                                    ? `$${product.priceWeightRatio.toFixed(2)}`
                                    : "—"}
                            </div>
                        </div>
                    );
                })}
        </div>
    </>)
}