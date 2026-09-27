import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {Product} from "@/generated/prisma/client";
import {use, useMemo} from "react";
import {create, insert, search} from "@orama/orama";
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

export default function ProductsTableBody({
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

            if (sortBy === "name") {

                const comparison =
                    productA.name.localeCompare(
                        productB.name
                    );

                return sortDirection === "ASC"
                    ? comparison
                    : -comparison;
            }

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

    const result = resultAsync as Exclude<typeof resultAsync, Promise<unknown>>;

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

    return (<div
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
    </div>)
}
