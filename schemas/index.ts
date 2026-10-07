import * as z from "zod";

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

export type LoginSchemaType = z.infer<typeof LoginSchema>;