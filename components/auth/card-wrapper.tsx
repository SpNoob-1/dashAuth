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
        // contenedor principal
        <Card className="w-full max-w-md shadow-md justify-center items-center ">
            {/* encabezado */}
            <CardHeader className="justify-center items-center w-full ">
                <Header label={headerLabel} />
            </CardHeader>
            {/* body formulario "children"*/}
            <CardContent className="w-100 ">
                {children}
            </CardContent>
            {/* social login github google */}
            {showSocial && (
                <CardFooter className="w-52" >
                    <Social />
                </CardFooter>
            )}
            {/* footer backbutton "no tienes una cuenta? " */}
            <CardFooter className="flex justify-center">
                <BackButton
                    href={backButtonHref}
                    label={backButtonLabel}
                />
            </CardFooter>
        </Card>
    )
}