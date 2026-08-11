import Image from "next/image";

import {createUser, goUp, getUsers, State} from '@/lib/actions'
import {prisma} from "@/lib/prisma";
import {User} from "@/generated/prisma/client";
import {Suspense} from "react";
import Users from "@/ui/Users";
import AddUser from "@/ui/AddUser";


export default async function Home() {
    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
            <AddUser />
            <Suspense fallback={'LOADING'}>
               <Users></Users>
            </Suspense>
        </main>
    );
}
