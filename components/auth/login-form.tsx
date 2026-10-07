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
import { LoginSchema, LoginSchemaType } from "@/schemas";
import { Formerrors } from "@/components/forn-erros";
import { FormSuccess } from "@/components/form-succes";

export const Loginform = () => {

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (data: LoginSchemaType) => {
        console.log(data);
    }

    return (
        <CardWrapper
            headerLabel="Inicio de sesión"
            backButtonLabel="¿No tienes una cuenta?"
            backButtonHref="/auth/register"
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
                    <Formerrors message={""} />
                    <FormSuccess message={""} />
                    <Field>
                        <Button type="submit" variant={"login"} className="w-full">
                            Login
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </CardWrapper >
    )
}