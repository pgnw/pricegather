'use client';
import AddUser from "@/ui/AddUser";
import {Suspense, useEffect, useState} from "react";
import Users from "@/ui/Users";
import Link from "next/link";

export default function Home() {
    const [count, setCount] = useState(0);
    useEffect(() => {

    }, []);
    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
            <label>Count: {count}</label>
            <div>

                <button className='m-1 cursor-pointer border p-1 ' onClick={(e) => {
                    setCount(count - 1);
                }}>Up
                </button>
                <button className='m-1 cursor-pointer border p-1' onClick={(e) => {
                    setCount(count + 1);
                }}>Down
                </button>
            </div>
        </main>
    );
}