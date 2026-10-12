import {cn} from "@/lib/utils";
import {SearchOptions} from "@/lib/Orama";
import {ProductWithMeasurement} from "@/lib/data/products";
import React from "react";

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


    return (<div
        className={cn(
            "grid",
            "grid-cols-[minmax(300px,1fr)_120px_120px_120px]",
            "gap-4 rounded-t-md border bg-muted/40",
            "px-4 py-3 text-sm font-medium text-muted-foreground"
        )}
    >
        <button type="button" className="text-left cursor-pointer" onClick={() => {
            if (searchOptions.sortBy != 'name') {
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "name",
                }))
            } else {
                invertSortDirection();
            }
        }}>
            Product
        </button>

        <button type="button" className="text-left cursor-pointer" onClick={() => {
            if (searchOptions.sortBy != 'grams') {
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "grams",
                }))
            } else {
                invertSortDirection();
            }
        }}>
            Weight
        </button>

        <button type="button" className="text-left cursor-pointer" onClick={() => {
            if (searchOptions.sortBy != 'price') {
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "price",
                }))
            } else {
                invertSortDirection();
            }
        }}>
            Price
        </button>

        <button type="button" className="text-left cursor-pointer" onClick={() => {
            if (searchOptions.sortBy != 'priceWeightRatio') {
                setSearchOptions(prev => ({
                    ...prev,
                    sortBy: "priceWeightRatio",
                }))
            } else {
                invertSortDirection();
            }
        }}>
            $ / 100g
        </button>
    </div>)
}
