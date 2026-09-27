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

export default function ProductsTableBodyLoading(
) {


    return (<div
        className={cn(
            "grid",
            "grid-cols-[minmax(300px,1fr)_120px_120px_120px]",
            "items-center gap-4 border-b px-4 py-3"
        )}>
    </div>)
}
