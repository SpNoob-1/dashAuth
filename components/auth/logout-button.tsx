"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/v1/auth/logout", { method: "POST" });
        router.push("/auth/login");
        router.refresh(); // Refresca el estado de Server Components
    };

    return (
        <Button onClick={handleLogout} variant="destructive" className="w-100">
            Cerrar Sesión
        </Button>
    );
}