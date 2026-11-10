"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MainBar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();

    const routes = [
        {
            href: `/sizes`,
            label: "Tamaños",
            active: pathname === `/sizes`,
        },

        {
            href: `/products`,
            label: "Productos",
            active: pathname === `/products`,
        },

        {
            href: `/categories`,
            label: "Categories",
            active: pathname === `/categories`,
        },

        {
            href: `/billboards`,
            label: "Billboards",
            active: pathname === `/billboards`,
        },

        {
            href: `/sections`,
            label: "Secciones",
            active: pathname === `/sections`,
        },

    ]


    return (
        <nav
            className={cn("flex flex-col items-start ml-6 space-y-4 lg:space-y-6", className)} {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}