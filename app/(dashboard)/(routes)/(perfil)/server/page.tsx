import { getCurrentUser } from "@/lib/auth";

export default async function ServerPage() {
    const user = await getCurrentUser();
    console.log(user)
    return (
        <div>
            <h1>Server Page</h1>
            <p>email: {user?.email}</p>
            <p>name: {user?.name}</p>
            <p>rol: {user?.rol}</p>
            <p>id: {user?.sub}</p>
        </div>
    );
}