import {Product} from "@/generated/prisma/client";
import {use} from "react";

export default function ProductsTableLoadedCount({count}: {count: number}) {

    return (
        <p className="text-sm text-muted-foreground mb-1">
            {count} results
        </p>
    )

}