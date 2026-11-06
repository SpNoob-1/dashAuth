"use client"

import { usePathname } from "next/navigation"
import { DropdownMenuAvatar } from "../app/(dashboard)/(routes)/(perfil)/_components/avatar";
import { MainBar } from "@/components/mainbar"


export const Sidebar = () => {

    return (
        <nav className="flex flex-col gap-y-2 w-50 p-2 shadow-sm shadow-gray-500/50 rounded-md h-full">
            <div className="flex items-center gap-x-2 rounded-md p-2 bg-secondary w-full " >
                <DropdownMenuAvatar />
                <p className="text-sm font-medium">Perfil</p>
            </div>
            <MainBar />

        </nav>

    )
}
