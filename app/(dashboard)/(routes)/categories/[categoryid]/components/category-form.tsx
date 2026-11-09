"use client";

import Heading from "@/components/heading";
import { categories, billboards } from "@/db/schema";
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
import { useRouter, useParams } from "next/navigation";
import { categorySchema, type categoriesSchemaType } from "@/schemas/index";
import axios from "axios";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Category = InferSelectModel<typeof categories>;
type Billboard = InferSelectModel<typeof billboards>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const params = useParams();

    const form = useForm<categoriesSchemaType>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData ? {
            name: initialData.name,
            billboardId: initialData.billboardId || ""
        } : {
            name: "",
            billboardId: "",
        }
    });

    const title = initialData ? "Editar Categoría" : "Crear Categoría";
    const description = initialData ? "Editar los datos de la categoría" : "Crea una nueva categoría";
    const toastMessage = initialData ? "Categoría actualizada correctamente" : "Categoría creada correctamente";
    const action = initialData ? "Guardar cambios" : "Crear";

    const onSubmit = async (data: categoriesSchemaType) => {
        setIsPending(true);
        try {
            let res;

            if (initialData) {
                res = await axios.patch(`/api/v1/admin/categories/${params.categoryid}`, data);
            } else {
                res = await axios.post(`/api/v1/admin/categories`, data);
            }

            const responseData = res.data;

            if (responseData?.error) {
                toast.error(responseData.error);
                return;
            }

            toast.success(responseData?.success || toastMessage);
            router.push(`/categories`);
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
                <Heading Title={title} Description={description} />
                {initialData && (
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                        disabled={isPending}
                        type="button"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator className="my-4 w-full" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Campo Nombre de Categoría */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="category-name">Categoría</FieldLabel>
                                    <Input
                                        {...field}
                                        id="category-name"
                                        placeholder="Nombre de la categoría"
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

                        {/* Selector de Billboards */}
                        <Controller
                            name="billboardId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="billboard-select">Billboard</FieldLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                    >
                                        <SelectTrigger id="billboard-select" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Selecciona un billboard">
                                                {field.value
                                                    ? billboards.find((b) => b.id === field.value)?.label
                                                    : "Selecciona un billboard"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Billboards</SelectLabel>
                                                {billboards.map((billboard) => (
                                                    <SelectItem key={billboard.id} value={billboard.id}>
                                                        {billboard.label}
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
                    </div>
                </FieldGroup>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardando..." : action}
                </Button>
            </form>
            <Separator />
        </div>
    );
};

export default CategoryForm;