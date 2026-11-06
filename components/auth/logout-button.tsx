"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/v1/auth/logout", { method: "POST" });
        router.push("/auth/login");
        router.refresh(); // Refresca el estado de Server Components
    };

    return (
        <Button onClick={handleLogout} variant="ghost" size={"sm"} className="w-full justify-start">
            <LogOutIcon className="h-4 w-4" />
            Cerrar Sesión
        </Button>
    );
}