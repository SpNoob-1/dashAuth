"use client";

import Heading from "@/components/heading";
import { sizes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { sizeSchema, type sizeSchemaType } from "@/schemas/index";
import axios from "axios"

type Size = InferSelectModel<typeof sizes>;

interface SizeFormProps {
    initialData: Size | null
}


const SizeForm = ({ initialData }: SizeFormProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const params = useParams();

    const form = useForm<sizeSchemaType>({
        resolver: zodResolver(sizeSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    });

    const title = initialData ? "Editar tamano" : "Creatar tamano";
    const description = initialData ? "Editar tamano" : "Creatar tamano";
    const toastMessage = initialData ? "Tamano Actualizado correctamente" : "Tamano Creado correctamente";
    const action = initialData ? "Guardar Cambios" : "Crear";



    const onSubmit = async (data: sizeSchemaType) => {
        setIsPending(true);
        try {
            let res;

            if (initialData) {
                res = await axios.patch(`/api/v1/admin/sizes/${params.sizeid}`, data);
            } else {
                res = await axios.post(`/api/v1/admin/sizes`, data);
            }

            const responseData = res.data;

            if (responseData?.error) {
                toast.error(responseData.error);
                return;
            }

            toast.success(responseData?.success || toastMessage);
            router.push(`/sizes`);
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
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="Nombre"
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
                            name="value"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="value">Value</FieldLabel>
                                    <Input
                                        {...field}
                                        id="value"
                                        placeholder="Valor"
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

export default SizeForm;