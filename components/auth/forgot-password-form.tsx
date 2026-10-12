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
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "@/schemas";
import { Formerrors } from "@/components/forn-erros";
import { FormSuccess } from "@/components/form-succes";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const ForgotPasswordForm = () => {

    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();



    const form = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = async (values: ForgotPasswordSchemaType) => {
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
            headerLabel="Restablecer Contraseña"
            backButtonLabel="Regresar al inicio"
            backButtonHref="/login"
            showSocial={false}
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

                    {serverError && <Formerrors message={serverError} />}
                    {successMessage && <FormSuccess message={successMessage} />}

                    <Field>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Validando..." : "Enviar Solicitud"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </CardWrapper >
    )
}