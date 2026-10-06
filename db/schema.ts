import { integer, pgTable, varchar, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";


export const roleEnum = pgEnum("rol_enum", ["CLIENTE", "ADMIN"]);


export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    rol: roleEnum(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}); 
