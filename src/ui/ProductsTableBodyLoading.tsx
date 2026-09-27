import {cn} from "@/lib/utils";

export default function ProductsTableBody(
) {
    return (<div
        className={cn(
            "grid",
            "grid-cols-[minmax(300px,1fr)_120px_120px_120px]",
            "items-center gap-4 border-b px-4 py-3 h-[45px]"
        )}
    >
        <div className="col-span-4 flex  flex-col items-center justify-center text-center">
        </div>
    </div>)
}
