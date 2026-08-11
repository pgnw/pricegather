import {getUsers} from "@/lib/actions";

export default async function Users() {
    const users = await getUsers();
    return (
        <>
            <div className={''}>
                {users.map((user) => (
                    <div className={'border border-black m-3 p-0.5'} key={user.id}>
                        <h3 className={'block'}>{user.name}</h3>
                        <h3 className={'block'}>{user.email}</h3>
                    </div>
                ))}
            </div>
        </>);
}

