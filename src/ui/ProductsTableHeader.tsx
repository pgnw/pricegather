import {cn} from "@/lib/utils";
import {SearchOptions} from "@/lib/Orama";
import {ProductWithMeasurement} from "@/lib/data/products";
import React from "react";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronDown, ChevronUp,
} from "lucide-react";

export default function ProductsTableHeader({searchOptions, setSearchOptions}: {
    searchOptions: SearchOptions,
    setSearchOptions: React.Dispatch<
        React.SetStateAction<SearchOptions>
    >;
}) {


    function invertSortDirection() {
        setSearchOptions(prev => ({
            ...prev,
            sortDirection: searchOptions.sortDirection === "ASC" ? "DESC" : "ASC"
        }))
    }

    function CurrentSortArrow() {
        if (searchOptions.sortDirection === "DESC")
            return <ArrowDown className="ml-0.5 inline h-3 w-3 sm:ml-1 sm:h-4 sm:w-4"/>;
        else
            return <ArrowUp className="ml-0.5 inline h-3 w-3 sm:ml-1 sm:h-4 sm:w-4"/>;

    }


    return (<div
            className={cn(
                "grid grid-cols-3 sm:grid-cols-[minmax(0,1fr)_120px_120px_120px]",
                "gap-x-2 gap-y-1 sm:gap-4 rounded-t-md border bg-muted/40",
                "px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-muted-foreground"
            )}
        >
            <div className="col-span-3 sm:col-span-1">

                <button type="button" className="text-left cursor-pointer hover:text-foreground"
                        onClick={() => {
                            if (searchOptions.sortBy === 'name')
                                invertSortDirection();
                            setSearchOptions(prev => ({
                                ...prev,
                                sortBy: "name",
                            }))

                        }}>
                    <span className="text-sm">Product</span>
                    {searchOptions.sortBy === "name" && <CurrentSortArrow/>}

                </button>
            </div>


            <button type="button" className="whitespace-nowrap text-left cursor-pointer hover:text-foreground" onClick={() => {
                if (searchOptions.sortBy === 'grams')
                    invertSortDirection();
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "grams",
                }))

            }}>
                <span>Weight</span>
                {searchOptions.sortBy === "grams" && <CurrentSortArrow/>}
            </button>

            <button type="button" className="whitespace-nowrap text-left cursor-pointer hover:text-foreground" onClick={() => {
                if (searchOptions.sortBy === 'price')
                    invertSortDirection();
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "price",
                }))

            }}>
                <span>Price</span>
                {searchOptions.sortBy === "price" && <CurrentSortArrow/>}
            </button>

            <button type="button" className="whitespace-nowrap text-left cursor-pointer hover:text-foreground" onClick={() => {
                if (searchOptions.sortBy === 'priceWeightRatio')
                    invertSortDirection();
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "priceWeightRatio",
                }))

            }}>
                <span>$ / 100g</span>
                {searchOptions.sortBy === "priceWeightRatio" && <CurrentSortArrow/>}
            </button>
        </div>
    )
}
