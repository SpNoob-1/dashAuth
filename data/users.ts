import { db } from "../index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return user;
    } catch (error) {
        console.log("Error al obtener el usuario por email", error);
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return user;
    } catch (error) {
        console.log("Error al obtener el usuario por ID", error);
        return null;
    }
}