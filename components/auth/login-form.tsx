"use client";

import { CardWrapper } from "./card-wrapper";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";

export const Loginform = () => {

    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    return (
        <CardWrapper
            headerLabel="Inicio de sesión"
            backButtonLabel="¿No tienes una cuenta?"
            backButtonHref="/auth/register"
            showSocial
        >
            loguin form!
        </CardWrapper>
    )
}