"use client";

import Heading from "@/components/heading";
import { billboards } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { billboardSchema, billboardSchemaType } from "@/schemas";
import axios from "axios"

type Billboard = InferSelectModel<typeof billboards>;

interface BillboardFormProps {
    initialData: Billboard | null
}


const BillboardForm = ({ initialData }: BillboardFormProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const params = useParams()

    const form = useForm<billboardSchemaType>({
        resolver: zodResolver(billboardSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    });

    const title = initialData ? "Editar Billboard" : "Crear Billboard";
    const description = initialData ? "Editar billboard" : "Crear billboard";
    const toastMessage = initialData ? "Billboard actualizado correctamente" : "Billboard creado correctamente";
    const action = initialData ? "Guardar Cambios" : "Crear";

    ////Actualizar y Crear Billboard////
    const onSubmit = async (data: billboardSchemaType) => {
        setIsPending(true);
        try {
            let res;

            if (initialData) {
                res = await axios.patch(`/api/v1/admin/billboards/${params.billboardid}`, data);
            } else {
                res = await axios.post(`/api/v1/admin/billboards`, data);
            }

            const responseData = res.data;

            if (responseData?.error) {
                toast.error(responseData.error);
                return;
            }

            toast.success(responseData?.success || toastMessage);
            router.push(`/billboards`);
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
                {initialData && (
                    <Button
                        variant="destructive"
                        size="icon-lg"
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

                    {/* cloudinary controller */}
                    <Controller
                        name="imageUrl"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Imagen del Billboard</FieldLabel>
                                <ImageUpload
                                    value={field.value ? [field.value] : []}
                                    disabled={isPending}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </Field>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3  ">
                        <Controller
                            name="label"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="store-name">Billboard</FieldLabel>
                                    <Input
                                        {...field}
                                        id="store-name"
                                        placeholder="Billboard label"
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

export default BillboardForm;