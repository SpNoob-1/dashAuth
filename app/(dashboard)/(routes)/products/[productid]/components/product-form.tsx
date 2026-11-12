"use client";

import Heading from "@/components/heading";
import { products, categories, sizes, images } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";
import { productSchemaUpdate, type productSchemaUpdateType } from "@/schemas/index";
import axios from "axios";

type Product = InferSelectModel<typeof products>;
type Image = InferSelectModel<typeof images>;
type Category = InferSelectModel<typeof categories>;
type Size = InferSelectModel<typeof sizes>;

interface ProductFormProps {
    initialData: (Product & { images: Image[] }) | null;
    categories: Category[];
    sizes: Size[];
}

const ProductForm = ({ initialData, categories, sizes }: ProductFormProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const params = useParams();

    const form = useForm<productSchemaUpdateType>({
        resolver: zodResolver(productSchemaUpdate) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description || "",
            price: Number(initialData.price) || 0,
            images: initialData.images?.map((img) => ({ url: img.url })) || [],
            categoryId: initialData.categoryId || "",
            sizeId: initialData.sizeId || "",
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            sizeId: "",
        }
    });

    const title = initialData ? "Editar Productos" : "Crear Productos";
    const description = initialData ? "Editar productos" : "Crear productos";
    const toastMessage = initialData ? "Producto actualizado correctamente" : "Producto creado correctamente";
    const action = initialData ? "Guardar cambios" : "Crear";

    const onSubmit = async (data: productSchemaUpdateType) => {

        setIsPending(true);
        try {
            let res;

            if (initialData) {
                res = await axios.patch(`/api/v1/admin/products/${params.productid}`, data);
            } else {
                res = await axios.post(`/api/v1/admin/products`, data);
            }

            const responseData = res.data;

            if (responseData?.error) {
                toast.error(responseData.error);
                return;
            }

            toast.success(responseData?.success || toastMessage);
            router.push(`/products`);
            router.refresh();

        } catch (err: any) {
            toast.error(err.response?.data?.error || "Ocurrió un error inesperado.");
        } finally {
            setIsPending(false);
        }
    };

    const onInvalid = (errors: any) => {
        console.error("❌ Errores de Zod en el formulario:", errors);
        toast.error("Revisa los campos obligatorios del formulario.");
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading Title={title} Description={description} />

            </div>
            <Separator className="my-4 w-full" />

            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 w-full">
                <FieldGroup>


                    {/* cloudinary controller */}
                    <Controller
                        name="images"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Imágenes del Producto</FieldLabel>
                                <ImageUpload
                                    value={field.value?.map((image: { url: string }) => image.url) || []}
                                    disabled={isPending}
                                    onChange={(url) => {
                                        // 🟢 Lee el estado MÁS RECIENTE directamente desde el formulario
                                        const currentImages = form.getValues("images") || [];
                                        field.onChange([...currentImages, { url }]);
                                    }}
                                    onRemove={(url) => {
                                        const currentImages = form.getValues("images") || [];
                                        field.onChange(
                                            currentImages.filter((image: { url: string }) => image.url !== url)
                                        );
                                    }}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />



                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Name */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-name">Nombre</FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-name"
                                        placeholder="Nombre del Producto"
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

                        {/* Price */}
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-price">Precio</FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-price"
                                        placeholder="Precio del Producto "
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        type="number"
                                        value={field.value === 0 ? "" : field.value}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === "" ? 0 : parseFloat(value));
                                        }}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Category */}
                        <Controller
                            name="categoryId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="category-select">Categoría</FieldLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                    >
                                        <SelectTrigger id="category-select" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Selecciona una categoría">
                                                {field.value ? categories.find((b) => b.id === field.value)?.name : "Selecciona una categoría"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Categorías</SelectLabel>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
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

                        {/* Size */}
                        <Controller
                            name="sizeId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="size-select">Tamaño</FieldLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                    >
                                        <SelectTrigger id="size-select" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Selecciona un tamaño">
                                                {field.value ? sizes.find((b) => b.id === field.value)?.name : "Selecciona un tamaño"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tamaños</SelectLabel>
                                                {sizes.map((size) => (
                                                    <SelectItem key={size.id} value={size.id}>
                                                        {size.name}
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

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-description">Descriptions</FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-description"
                                        placeholder="Descripccion del Producto"
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

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardar..." : action}
                </Button>
            </form>
            <Separator />
        </div>
    );
};

export default ProductForm;