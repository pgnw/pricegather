'use client';
import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import {useDebouncedCallback} from "use-debounce";

export default function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    const handleSearchChange = useDebouncedCallback((searchText: string)=>
    {
        console.log(searchText);
        const params = new URLSearchParams(searchParams);
        if (searchText) {
            params.set("search", searchText);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
    },20);

    return (
        <>
            <input onChange={(e) => handleSearchChange(e.target.value)} className={'p-1 bg-white rounded-md'}
                   placeholder={'Product Search...'} defaultValue={searchParams.get('search')?.toString()}/>
        </>
    );
}

