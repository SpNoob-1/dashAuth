import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    return (
        <div>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <h1>{user?.name}</h1>
            <LogoutButton />
        </div>
    );
}
