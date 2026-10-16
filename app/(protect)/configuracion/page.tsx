
import { getCurrentUser } from "@/lib/auth";
import { SettingsForm } from "@/components/auth/settings";


export default async function SettingsPage() {

    const user = await getCurrentUser();

    if (!user) return null

    return (
        <div >
            <SettingsForm user={user} />
        </div>
    );
}
