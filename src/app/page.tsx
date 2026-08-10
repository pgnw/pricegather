import Image from "next/image";

import {prisma} from "@/lib/prisma";
import {createUser} from '@/lib/actions'

export default async function Home() {
    //await createUser();
    const users = await prisma.user.findMany();

    return (
        <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
            <form>
                <h2 className={'text-2xl'}>Create new user</h2>

                <label className={'mb-2 block text-sm font-medium'}>Name</label>
                <input className={' bg-blue-200'} name="name" type="text"/>

                <label className={'mb-2 block text-sm font-medium'}>Email</label>
                <input className={' bg-blue-200'} name="email" type="text"/>

                <button className={'block mt-2 border rounded-md py-0.5 px-1 hover:bg-red-600 cursor-pointer'} >Submit</button>
            </form>
            <div className={''}>
                {users.map((user) => (
                    <div className={'border border-black mb-2'} key={user.id} >
                        {user.name}
                    </div>
                ))}
            </div>


        </main>
    );
}
