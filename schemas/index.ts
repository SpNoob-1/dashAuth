import * as z from "zod";

export const LoginSchema = z.object({
    email: z.email("Email must be an email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});