// app/(protect)/roldemo/page.tsx
import { FormSuccess } from "@/components/form-succes";
import { Formerrors } from "@/components/forn-erros";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import Getdemo from "./getdemo";


export default async function RolDemoPage() {

    const user = await getCurrentUser();


    if (!user) return null


    if (user.rol === "ADMIN") {
        return (
            <Card className="flex w-50 ">
                <CardHeader>
                    <CardTitle>Admin</CardTitle>
                    <CardDescription>Admin Dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full mb-2">
                        <FormSuccess message="Rol Admin" />
                    </div>
                    <Getdemo />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex w-50 ">
            <CardHeader>
                <CardTitle>Cliente</CardTitle>
                <CardDescription>Cliente </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex mb-2 w-full">
                    <Formerrors message="Rol Cliente" />
                </div>
                <Getdemo />
            </CardContent>
        </Card>
    )
}
