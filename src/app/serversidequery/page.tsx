import AddUser from "@/ui/AddUser";
import {Suspense} from "react";
import Users from "@/ui/Users";
import Link from "next/link";

export default async function Home() {
    return (
        <main className="font-sans text-black max-w-6xl mx-auto w-1/3 mt-2">
            <div className={'flex flex-col flex-1 items-center mt-5 bg-red'}>
                <h1 className={'text-2xl font-bold '}>Product Search (serverside)</h1>
            </div>
        </main>
    );
}
