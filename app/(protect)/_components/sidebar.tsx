"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";
import { User, Server, Package } from "lucide-react";

import { DropdownMenuAvatar } from "./avatar"

export const Sidebar = () => {

    const pathname = usePathname()

    return (
        <nav className="flex flex-col gap-y-2 w-50 p-2 shadow-sm shadow-gray-500/50 rounded-md h-full">
            <div className="flex items-center gap-x-2 rounded-md p-2 bg-secondary">
                <DropdownMenuAvatar />
                <p className="text-sm font-medium">Perfil</p>
            </div>
            <Link href="/configuracion" className={`flex items-center gap-x-2 rounded-md p-2 cursor-pointer ${pathname === "/configuracion" ? "bg-secondary" : ""}`}>
                <User className="w-4 h-4" />
                <p>Configuracion</p>
            </Link>

            <Link href="/server" className={`flex items-center gap-x-2 rounded-md p-2 cursor-pointer ${pathname === "/server" ? "bg-secondary" : ""}`}>
                <Server className="w-4 h-4" />
                <p>Server Component</p>
            </Link>

            <Link href="/client" className={`flex items-center gap-x-2 rounded-md p-2 cursor-pointer ${pathname === "/client" ? "bg-secondary" : ""}`}>
                <Package className="w-4 h-4" />
                <p>Client Component</p>
            </Link>

            <Link href="/roldemo" className={`flex items-center gap-x-2 rounded-md p-2 cursor-pointer ${pathname === "/roldemo" ? "bg-secondary" : ""}`}>
                <Package className="w-4 h-4" />
                <p>Rol Demo</p>
            </Link>

        </nav>
    )
}
