"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
    href: string;
    label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
    return (
        <Button
            variant="link"
            size="sm"
            render={<Link href={href} />}
            nativeButton={false}
        >
            {label}
        </Button>
    );
};