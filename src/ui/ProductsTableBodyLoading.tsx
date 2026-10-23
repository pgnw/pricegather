import {cn} from "@/lib/utils";

export default function ProductsTableBody(
) {
    return (<div
        className={cn(
            "grid grid-cols-3 sm:grid-cols-[minmax(0,1fr)_120px_120px_120px]",
            "items-center gap-2 sm:gap-4 border-b px-2 py-3 sm:px-4 h-[45px]"
        )}
    >
        <div className="col-span-3 flex flex-col items-center justify-center text-center sm:col-span-4">
        </div>
    </div>)
}
