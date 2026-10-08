import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    return (
        <div>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}
