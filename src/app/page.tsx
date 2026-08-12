import Image from "next/image";

import {createUser, goUp, getUsers, State} from '@/lib/actions'
import {prisma} from "@/lib/prisma";
import {User} from "@/generated/prisma/client";
import {Suspense} from "react";
import Users from "@/ui/Users";
import AddUser from "@/ui/AddUser";
import Link from "next/link";


export default async function Home() {
    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
            <AddUser />
            <Suspense fallback={'LOADING'}>
                <Users></Users>
            </Suspense>
            <Link className={'text-blue-600 underline hover:text-blue-800'} href='/testing'>Testing</Link>
        </main>
    );
}
