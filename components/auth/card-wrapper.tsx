"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial }: CardWrapperProps) => {
    return (
        <Card>
            {children}
        </Card>
    )
}