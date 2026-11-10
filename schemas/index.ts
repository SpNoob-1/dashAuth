import * as z from "zod";
import { roleEnum } from "@/db/schema";
import { title } from "process";


export const SettingsSchema = z.object({
    name: z.optional(
        z.string()
            .min(1, { message: "El nombre no puede estar vacío" })
            .max(50, { message: "El nombre no puede sobrepasar los 50 caracteres" })
            .trim()
    ),

    rol: z.optional(z.enum(roleEnum.enumValues)),

    email: z.optional(
        z.string()
            .min(1, { message: "El correo electrónico no puede estar vacío" })
            .email({ message: "Ingresa un correo electrónico válido" })
            .toLowerCase()
            .trim()
    ),

    // CAMBIO CRUCIAL: Envueltas en z.optional() para que si van vacías ("" o undefined) no fallen
    password: z.optional(
        z.string()
            .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
            .max(72, { message: "La contraseña sobrepasa el límite permitido" })
            .or(z.literal("")) // Permite cadena vacía si no se desea cambiar
    ),

    newPassword: z.optional(
        z.string()
            .min(6, { message: "La nueva contraseña debe tener al menos 6 caracteres" })
            .max(72, { message: "La nueva contraseña sobrepasa el límite permitido" })
            .or(z.literal("")) // Permite cadena vacía
    ),
}).refine((data) => {
    // Solo valida si el usuario escribió algo en alguna de las dos
    if (data.password && !data.newPassword) {
        return false;
    }
    return true;
}, {
    message: "La nueva contraseña es requerida",
    path: ["newPassword"]
}).refine((data) => {
    if (data.newPassword && !data.password) {
        return false;
    }
    return true;
}, {
    message: "La contraseña actual es requerida",
    path: ["password"]
});


export const NewPasswordSchema = z.object({
    password: z
        .string({
            message: "La contraseña es requerida",
        })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(72, { message: "La contraseña sobrepasa el límite permitido" }),

    confirmPassword: z
        .string({
            message: "La confirmación de la contraseña es requerida",
        })
        .min(1, { message: "La confirmación de la contraseña no puede estar vacía" }),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});


export const forgotPasswordSchema = z.object({
    email: z
        .string({
            message: "El correo electrónico es requerido",
        })
        .min(1, { message: "El correo electrónico no puede estar vacío" })
        .email({ message: "Ingresa un correo electrónico válido" })
        .toLowerCase()
        .trim(),
});



export const LoginSchema = z.object({
    email: z
        .string({
            message: "El correo electrónico es requerido",
        })
        .min(1, { message: "El correo electrónico no puede estar vacío" })
        .email({ message: "Ingresa un correo electrónico válido" })
        .toLowerCase()
        .trim(),

    password: z
        .string({
            message: "La contraseña es requerida",
        })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(72, { message: "La contraseña sobrepasa el límite permitido" }),
});

export const RegisterSchema = z.object({

    name: z
        .string({
            message: "El nombre es requerido",
        })
        .min(1, { message: "El nombre no puede estar vacío" })
        .max(50, { message: "El nombre no puede sobrepasar los 50 caracteres" })
        .trim(),
    email: z
        .string({
            message: "El correo electrónico es requerido",
        })
        .min(1, { message: "El correo electrónico no puede estar vacío" })
        .email({ message: "Ingresa un correo electrónico válido" })
        .toLowerCase()
        .trim(),

    password: z
        .string({
            message: "La contraseña es requerida",
        })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(72, { message: "La contraseña sobrepasa el límite permitido" }),

    confirmPassword: z
        .string({
            message: "La confirmación de la contraseña es requerida",
        })
        .min(1, { message: "La confirmación de la contraseña no puede estar vacía" }),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

// PRODUCTS

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "El nombre del producto es requerido." })
        .max(100, { message: "El nombre no puede exceder los 100 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El nombre no puede contener únicamente espacios en blanco.",
        }),
    images: z
        .array(
            z.object({
                url: z
                    .string({ message: "La URL de la imagen es requerida." })
                    .trim()
                    .url({ message: "Cada imagen debe ser una URL válida." }),
            })
        )
        .min(1, { message: "Debes subir al menos una imagen para el producto." }),

    price: z.coerce
        .number({ message: "El precio debe ser un número válido." })
        .min(0.01, { message: "El precio debe ser mayor a 0." })
        .max(999999.99, { message: "El precio no puede exceder $999,999.99." })
        .refine((val) => Number(val.toFixed(2)) === val, {
            message: "El precio no puede tener más de 2 decimales.",
        }),

    categoryId: z
        .string({ message: "La categoría es obligatoria." })
        .trim()
        .min(1, { message: "La categoría es obligatoria." }),

    sizeId: z
        .string({ message: "El tamaño es obligatorio." })
        .trim()
        .min(1, { message: "El tamaño es obligatorio." }),


});

export const productSchemaIsLanding = z.object({
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

export const productSchemaReorden = z.object({
    items: z.array(
        z.object({
            id: z.string().uuid(),
            order: z.number().int(),
        })
    ),
});

export const productSchemaUpdate = productSchema.partial();

// CATEGORIES

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "El nombre de la categoría es obligatorio." })
        .max(50, { message: "El nombre no puede exceder los 50 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El nombre no puede contener únicamente espacios en blanco.",
        }),

    billboardId: z
        .string({ message: "Debes seleccionar un billboard." })
        .trim()
        .min(1, { message: "El billboard es requerido." })
});

export const categorySchemaIsLanding = z.object({
    isFeatured: z.boolean().default(false).optional(),
})

export const categoryctSchemaReorden = z.object({
    items: z.array(
        z.object({
            id: z.string().uuid(),
            order: z.number().int(),
        })
    ),
});

// BILLBOARDS

export const billboardSchema = z.object({
    label: z
        .string({ message: "El título/label es obligatorio." })
        .trim()
        .min(1, { message: "El título del billboard es obligatorio." })
        .max(100, { message: "El título no puede exceder los 100 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El título no puede contener únicamente espacios en blanco.",
        }),

    imageUrl: z
        .string({ message: "La imagen es obligatoria." })
        .trim()
        .min(1, { message: "Debes subir una imagen para el billboard." })
});

// SIZES

export const sizeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "El nombre del tamaño es obligatorio." })
        .max(30, { message: "El nombre no puede exceder los 30 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El nombre no puede contener únicamente espacios en blanco.",
        }),

    value: z
        .string()
        .trim()
        .min(1, { message: "El valor o abreviación es requerido (ej. S, M, L, 42)." })
        .max(10, { message: "El valor no puede tener más de 10 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El valor no puede contener únicamente espacios en blanco.",
        }),
});

// SECTIONS

export const sectionSchema = z.object({
    key: z
        .string()
        .trim()
        .min(1, { message: "La clave es obligatoria" })
        .refine((val) => val.trim().length > 0, {
            message: "La clave no puede contener únicamente espacios en blanco.",
        }),

    title: z
        .string()
        .trim()
        .min(1, { message: "El título es obligatorio." })
        .max(30, { message: "El título no puede exceder los 30 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El título no puede contener únicamente espacios en blanco.",
        }),

    subtitle: z
        .string()
        .trim()
        .min(1, { message: "El subtítulo es obligatorio." })
        .max(250, { message: "El subtítulo no puede exceder los 250 caracteres." })
        .refine((val) => val.trim().length > 0, {
            message: "El subtítulo no puede contener únicamente espacios en blanco.",
        }),
});

export const sectionSchemaIsactive = z.object({
    isActive: z.boolean().default(false).optional(),
})

export const sectionSchemaReorden = z.object({
    items: z.array(
        z.object({
            id: z.string().uuid(),
            order: z.number().int(),
        })
    ),
});

// SECTION 
export type sectionSchemaType = z.infer<typeof sectionSchema>

// SIZES
export type sizeSchemaType = z.infer<typeof sizeSchema>;

// BILLBOARDS
export type billboardSchemaType = z.infer<typeof billboardSchema>;

// CATEGORIES
export type categoriesSchemaType = z.infer<typeof categorySchema>;

// PRODUCTS
export type productSchemaUpdateType = z.infer<typeof productSchemaUpdate>;
export type productSchemaType = z.infer<typeof productSchema>;
export type productSchemaIsLandingType = z.infer<typeof productSchemaIsLanding>;
export type productSchemaReordenType = z.infer<typeof productSchemaReorden>;

// AUHT
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type SettingsSchemaType = z.infer<typeof SettingsSchema>;


