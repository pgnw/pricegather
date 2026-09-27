import {cn} from "@/lib/utils";

export default function ProductsTableHeader()
{
    return (<div
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
    </div>)
}