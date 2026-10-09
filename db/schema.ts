import { integer, pgTable, varchar, timestamp, uuid, pgEnum, text, primaryKey } from "drizzle-orm/pg-core";
import crypto from "node:crypto"


export const roleEnum = pgEnum("rol_enum", ["CLIENTE", "ADMIN"]);


export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: varchar("password", { length: 255 }).notNull(),
    rol: roleEnum(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const verificationToken = pgTable("verification_token", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()), // Genera un ID único para la fila
    email: text("email").notNull(),
    token: text("token").notNull().unique(), // Token único (UUID) que irá en la URL
    expires: timestamp("expires", { mode: "date" }).notNull(), // Fecha y hora de vencimiento
},
    (table) => [
        // Garantiza que la combinación de email y token sea única
        primaryKey({ columns: [table.id, table.token] }),
    ]
);