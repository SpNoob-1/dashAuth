"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./backbutton";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial }: CardWrapperProps) => {
    return (
        <Card className="w-full max-w-md shadow-md ">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent className="w-100">
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter >
                    <Social />
                </CardFooter>
            )}
            <CardFooter className="flex justify-center">
                <BackButton
                    href={backButtonHref}
                    label={backButtonLabel}
                />
            </CardFooter>
        </Card>
    )
}