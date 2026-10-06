"use client";

import { CardWrapper } from "./card-wrapper";

export const Loginform = () => {
    return (
        <CardWrapper
            headerLabel="Inicio de sesión"
            backButtonLabel="¿No tienes una cuenta?"
            backButtonHref="/auth/register"
            showSocial
        >
            loguin form
        </CardWrapper>
    )
}