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
import { RegisterSchema, type RegisterSchemaType } from "@/schemas";
import { Formerrors } from "@/components/forn-erros";
import { FormSuccess } from "@/components/form-succes";
import { useState } from "react";

export const Registerform = () => {

    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (values: RegisterSchemaType) => {
        setServerError(null);
        setSuccessMessage(null);
        setIsPending(true);

        try {
            const response = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.error || "Ocurrió un error en Registro");
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
            headerLabel="Registro de usuario"
            backButtonLabel="¿Ya tienes una cuenta?"
            backButtonHref="/login"
            showSocial
        >
            <form id="form-rhf-register" onSubmit={form.handleSubmit(onSubmit)} >
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-register-name">
                                    Nombre
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-register-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="John Doe"
                                    type="text"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-register-email">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-register-email"
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
                                <FieldLabel htmlFor="form-rhf-register-password">
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-register-password"
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

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-register-confirmPassword">
                                    Confirmar Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-register-confirmPassword"
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
                            {isPending ? "Validando..." : "Registrarse"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </CardWrapper >
    )
}