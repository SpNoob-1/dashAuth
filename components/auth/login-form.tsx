"use client";

import { CardWrapper } from "./card-wrapper";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "@/schemas";
import { Formerrors } from "@/components/forn-erros";
import { FormSuccess } from "@/components/form-succes";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const Loginform = () => {

    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();



    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: LoginSchemaType) => {
        setServerError(null);
        setSuccessMessage(null);
        setIsPending(true);

        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            // Si la respuesta es exitosa, redirigir al usuario a la página de configuración y refrescar la página.

            if (response.ok) {
                router.push("/configuracion");
                router.refresh();
            }

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.error || "Ocurrió un error en la autenticación");
                return;
            }

            setSuccessMessage(data.message);
            console.log("Respuesta de la API:", data);
        } catch (err) {
            setServerError("Error de conexión con el servidor");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <CardWrapper
            headerLabel="Inicio de sesión"
            backButtonLabel="¿No tienes una cuenta?"
            backButtonHref="/register"
            showSocial
        >
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} >
                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-email">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="JoDoe@example.com"
                                    type="email"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-password">
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="********"
                                    type="password"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    {serverError && <Formerrors message={serverError} />}
                    {successMessage && <FormSuccess message={successMessage} />}
                    <Field>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Validando..." : "Iniciar Sesión"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </CardWrapper >
    )
}