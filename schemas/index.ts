import * as z from "zod";
import { roleEnum } from "@/db/schema";

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

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type SettingsSchemaType = z.infer<typeof SettingsSchema>;
