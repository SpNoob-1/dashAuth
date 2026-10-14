import { getCurrentUser } from "@/lib/auth";
import GetClientProfile from "./getclientprofile";


export default async function ClientProfile() {
    const user = await getCurrentUser();

    return (
        <GetClientProfile user={user} />
    )
}
