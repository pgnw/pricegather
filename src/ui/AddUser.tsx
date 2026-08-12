'use client';
import {createUser, getUsers, State} from "@/lib/actions";
import {useActionState} from "react";

export default function AddUser() {
    const intialState: State = {message: null, errors: {}};
    const [state, formAction] = useActionState(createUser, intialState);
    return (
        <>
            <form action={formAction}>
                <div className="flex flex-col ">

                    <h2 className={'text-2xl'}>Create new user</h2>

                    <label className={'mb-2 block text-sm font-medium'}>Name</label>
                    <input autoComplete='off' className={' bg-blue-200'} name="username" type="text" required/>

                    <label className={'mb-2 block text-sm font-medium'}>Email</label>
                    <input autoComplete='off' className={' bg-blue-200'} name="email" type="text" required/>

                    <button type={'submit'} className={'block border border-black cursor-pointer p-1 m-2'}>Submit
                    </button>
                </div>
            </form>
        </>
    )
}
