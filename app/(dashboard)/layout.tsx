import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/register");
    }

    // 3. Validamos si su rol es ADMIN
    if (user.rol !== "ADMIN") {
        redirect("/auth/loguin")
    }

    return (
        <>
            <div className="flex flex-row ">
                <Sidebar />
                <div className="flex w-full items-center justify-center ">
                    {children}
                </div>
            </div>

        </>
    );
}