'use client';
import AddUser from "@/ui/AddUser";
import {Suspense, useEffect, useState} from "react";
import Users from "@/ui/Users";
import Link from "next/link";

export default function Home() {
    const [count, setCount] = useState(0);
    console.log('re rendering');
    useEffect(() => {
        console.log('use effect ' + count);
        return () =>{
            console.log('return function running');
        }
    }, [count]);

    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
            <div>
                <div className={'block'}>
                    <label>count: {count}</label>
                </div>
                <button className={'border border-black cursor-pointer p-1 m-1'}
                        onClick={() => setCount(count - 1)}>Go Down
                </button>
                <button className={'border border-black cursor-pointer p-1 m-1'}
                        onClick={() => setCount(count + 1)}>Go Up
                </button>
            </div>
            <Link className={'text-blue-600 underline hover:text-blue-800'} href='/'>Home</Link>
        </main>
    );
}