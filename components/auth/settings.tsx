"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Formerrors } from "@/components/forn-erros";
import { FormSuccess } from "@/components/form-succes";
import { SettingsSchema, type SettingsSchemaType } from "@/schemas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleEnum } from "@/db/schema";
export type UserRole = (typeof roleEnum.enumValues)[number];

interface SettingsFormProps {
    user: {
        name?: string | null;
        email?: string | null;
        rol?: UserRole | null;
        emailVerified?: boolean | null;
    }
}

export function SettingsForm({ user }: SettingsFormProps) {

    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);


    const form = useForm<SettingsSchemaType>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: "",
            newPassword: "",
            rol: user?.rol ?? "CLIENTE"
        }
    });

    const onSubmit = async (values: SettingsSchemaType) => {
        setServerError(null);
        setSuccessMessage(null);
        setIsPending(true);

        try {
            const response = await fetch("/api/v1/auth/settings", {
                method: "PATCH",
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
        <div>
            <Card className="w-100">
                <CardHeader>
                    <CardTitle>Configuración</CardTitle>
                    <CardDescription>Actualiza tu configuración</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <form id="form-rhf-settings" onSubmit={form.handleSubmit(onSubmit)}>
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
                                    name="newPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-register-newPassword">
                                                Nueva Password
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-register-newPassword"
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
                                    name="rol"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-register-rol">
                                                Rol
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                id="form-rhf-register-rol"
                                                aria-invalid={fieldState.invalid}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar Rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {roleEnum.enumValues.map((rol) => (
                                                            <SelectItem key={rol} value={rol}>
                                                                {rol}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                            </FieldGroup>
                        </form>
                        {serverError && <Formerrors message={serverError} />}
                        {successMessage && <FormSuccess message={successMessage} />}
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                            Actualizar Configuración
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
