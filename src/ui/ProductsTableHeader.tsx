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
            return <ArrowDown className={'inline h-4 w-4 ml-1 '}/>;
        else
            return <ArrowUp className={'inline h-4 w-4 ml-1'}/>;

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
                            if (searchOptions.sortBy === 'name')
                                invertSortDirection();
                            setSearchOptions(prev => ({
                                ...prev,
                                sortBy: "name",
                            }))

                        }}>
                    <span>Product</span>
                    {searchOptions.sortBy === "name" && <CurrentSortArrow/>}

                </button>
            </div>


            <button type="button" className="text-left cursor-pointer hover:text-foreground" onClick={() => {
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

            <button type="button" className="text-left cursor-pointer hover:text-foreground" onClick={() => {
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

            <button type="button" className="text-left cursor-pointer hover:text-foreground" onClick={() => {
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
