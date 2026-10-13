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
        if (searchOptions.sortDirection === "ASC")
            return <ArrowDown className={'inline h-4 w-4 ml-1.5 '}/>;
        else
            return <ArrowUp className={'inline h-4 w-4 ml-1.5'}/>;

    }


    return (<div
            className={cn(
                "grid",
                "grid-cols-[minmax(300px,1fr)_120px_120px_120px]",
                "gap-4 rounded-t-md border bg-muted/40",
                "px-4 py-3 text-sm font-medium text-muted-foreground"
            )}
        >
            <div>

                <button type="button" className="text-left cursor-pointer hover:text-foreground"
                        onClick={() => {
                            if (searchOptions.sortBy != 'name') {
                                setSearchOptions(prev => ({
                                    ...prev,
                                    sortBy: "name",
                                }))
                            } else {
                                invertSortDirection();
                            }
                        }}>
                    <span>Product</span>
                    {searchOptions.sortBy === "name" && <CurrentSortArrow/>}

                </button>
            </div>


            <button type="button" className="text-left cursor-pointer hover:text-foreground" onClick={() => {
                if (searchOptions.sortBy != 'grams') {
                    setSearchOptions(prev => ({
                        ...prev,
                        sortBy: "grams",
                    }))
                } else {
                    invertSortDirection();
                }
            }}>
                <span>Weight</span>
                {searchOptions.sortBy === "grams" && <CurrentSortArrow/>}
            </button>

            <button type="button" className="text-left cursor-pointer hover:text-foreground" onClick={() => {
                if (searchOptions.sortBy != 'price') {
                    setSearchOptions(prev => ({
                        ...prev,
                        sortBy: "price",
                    }))
                } else {
                    invertSortDirection();
                }
            }}>
                <span>Price</span>
                {searchOptions.sortBy === "price" && <CurrentSortArrow/>}
            </button>

            <button type="button" className="text-left cursor-pointer hover:text-foreground" onClick={() => {
                if (searchOptions.sortBy != 'priceWeightRatio') {
                    setSearchOptions(prev => ({
                        ...prev,
                        sortBy: "priceWeightRatio",
                    }))
                } else {
                    invertSortDirection();
                }
            }}>
                <span>$ / 100g</span>
                {searchOptions.sortBy === "priceWeightRatio" && <CurrentSortArrow/>}
            </button>
        </div>
    )
}
