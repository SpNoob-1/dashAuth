"use client";

import Heading from "@/components/heading";
import { landingSecciones } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { sectionSchema, type sectionSchemaType } from "@/schemas/index";
import axios from "axios"

type Sections = InferSelectModel<typeof landingSecciones>;

interface SectionFormProps {
    initialData: Sections | null
}


const SectionForm = ({ initialData }: SectionFormProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const params = useParams();

    const form = useForm<sectionSchemaType>({
        resolver: zodResolver(sectionSchema),
        defaultValues: initialData ? {
            key: initialData.key || "",
            // Transformamos el null en un string vacío
            title: initialData.title || "",
            subtitle: initialData.subtitle || "",
        } : {
            key: "",
            title: "",
            subtitle: "",
        }
    });

    const title = initialData ? "Editar seccion" : "Crear seccion";
    const description = initialData ? "Editar seccion" : "Crear seccion";
    const toastMessage = initialData ? "Seccion Actualizada correctamente" : "Seccion Creada correctamente";
    const action = initialData ? "Guardar Cambios" : "Crear";



    const onSubmit = async (data: sectionSchemaType) => {
        setIsPending(true);
        try {
            let res;

            if (initialData) {
                res = await axios.patch(`/api/v1/admin/sections/${params.sectionid}`, data);
            } else {
                res = await axios.post(`/api/v1/admin/sections`, data);
            }

            const responseData = res.data;

            if (responseData?.error) {
                toast.error(responseData.error);
                return;
            }

            toast.success(responseData?.success || toastMessage);
            router.push(`/sections`);
            router.refresh();

        } catch (err: any) {
            toast.error(err.response?.data?.error || "Ocurrió un error inesperado.");
        } finally {
            setIsPending(false);
        }
    };



    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={title}
                    Description={description}
                />
            </div>
            <Separator className="my-4 w-full" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                        <Controller
                            name="key"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Clave</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="Clave"
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="value">Titulo</FieldLabel>
                                    <Input
                                        {...field}
                                        id="value"
                                        placeholder="Titulo"
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="subtitle"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="value">Sub Titulo</FieldLabel>
                                    <Input
                                        {...field}
                                        id="value"
                                        placeholder="Sub Titulo"
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </FieldGroup>

                <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                >
                    {isPending ? "Guardando..." : action}
                </Button>
            </form>
            <Separator />
        </div>
    );
};

export default SectionForm;