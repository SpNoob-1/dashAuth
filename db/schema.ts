import { integer, pgTable, varchar, timestamp, uuid, pgEnum, text, boolean, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import crypto from "node:crypto";

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
        .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const passwordResetTokens = pgTable("password_reset_token", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

// SECCIONES DEL LANDING //
export const landingSecciones = pgTable("landing_secciones", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    title: varchar("title", { length: 255 }),
    subtitle: text("subtitle"),
    order: integer("order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// DEPARTAMENTOS //
export const departamentos = pgTable("departamentos", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// MUNICIPIOS //
export const municipios = pgTable("municipios", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    departamentoId: uuid("departamento_id")
        .notNull()
        .references(() => departamentos.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// DIRECCIONES //
export const addresses = pgTable("addresses", {
    id: uuid("id").primaryKey().defaultRandom(),
    alias: varchar("alias", { length: 100 }).notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    municipioId: uuid("municipio_id")
        .notNull()
        .references(() => municipios.id, { onDelete: "restrict" }),
    street: varchar("street", { length: 255 }).notNull(),
    details: text("details"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// CARTELES //
export const billboards = pgTable("billboards", {
    id: uuid("id").primaryKey().defaultRandom(),
    label: varchar("label", { length: 255 }).notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// CATEGORÍAS //
export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    order: integer("order").notNull().default(10),
    isFeatured: boolean("is_featured").default(false).notNull(),
    billboardId: uuid("billboard_id")
        .references(() => billboards.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// TAMAÑOS //
export const sizes = pgTable("sizes", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// PRODUCTOS //
export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    categoryId: uuid("category_id")
        .references(() => categories.id, { onDelete: "restrict" }),
    sizeId: uuid("size_id")
        .references(() => sizes.id, { onDelete: "restrict" }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    description: text("description").default("No Description"),
    order: integer("order").notNull().default(10),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    index("idx_products_category").on(table.categoryId),
    index("idx_products_featured").on(table.isFeatured),
]);

// IMÁGENES //
export const images = pgTable("images", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// ESTADOS DE PEDIDOS (Movido arriba de orders por dependencia) //
export const ordersStates = pgTable("orders_states", {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: varchar("nombre", { length: 100 }).notNull().unique(),
    esFinal: boolean("es_final").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// PEDIDOS //
export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "restrict" }),
    estadoPedidoId: uuid("estado_pedido_id")
        .notNull()
        .references(() => ordersStates.id, { onDelete: "restrict" }),
    isPaid: boolean("is_paid").default(false).notNull(),
    phone: varchar("phone", { length: 50 }).default("").notNull(),
    addressAlias: varchar("address_alias", { length: 100 }).notNull(),
    addressStreet: varchar("address_street", { length: 255 }).notNull(),
    addressDetails: text("address_details"),
    municipioName: varchar("municipio_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    index("idx_orders_user").on(table.userId),
    index("idx_orders_estado").on(table.estadoPedidoId),
]);

// ITEMS DE PEDIDOS //
export const orderItems = pgTable("order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// EXCLUSIONES DE ITEMS DE PEDIDO //
export const exclusionsDetail = pgTable("exclusions_detail", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderItemId: uuid("order_item_id")
        .notNull()
        .references(() => orderItems.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


// RELACIONES //

export const users_Relations = relations(users, ({ many }) => ({
    addresses: many(addresses),
    orders: many(orders),
}));

export const addresses_Relations = relations(addresses, ({ one }) => ({
    user: one(users, {
        fields: [addresses.userId],
        references: [users.id],
    }),
    municipio: one(municipios, {
        fields: [addresses.municipioId],
        references: [municipios.id],
    }),
}));

export const departamentos_Relations = relations(departamentos, ({ many }) => ({
    municipios: many(municipios),
}));

export const municipios_Relations = relations(municipios, ({ one }) => ({
    departamento: one(departamentos, {
        fields: [municipios.departamentoId],
        references: [departamentos.id],
    }),
}));

export const categories_Relations = relations(categories, ({ one, many }) => ({
    products: many(products),
    billboard: one(billboards, {
        fields: [categories.billboardId],
        references: [billboards.id],
    }),
}));

export const billboards_Relations = relations(billboards, ({ many }) => ({
    categories: many(categories),
}));

export const products_Relations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    size: one(sizes, {
        fields: [products.sizeId],
        references: [sizes.id],
    }),
    images: many(images),
}));

export const sizes_Relations = relations(sizes, ({ many }) => ({
    products: many(products),
}));

export const images_Relations = relations(images, ({ one }) => ({
    product: one(products, {
        fields: [images.productId],
        references: [products.id],
    }),
}));

export const ordersStates_Relations = relations(ordersStates, ({ many }) => ({
    orders: many(orders),
}));

export const orders_Relations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    estadoPedido: one(ordersStates, {
        fields: [orders.estadoPedidoId],
        references: [ordersStates.id],
    }),
    orderItems: many(orderItems),
}));

export const orderItems_Relations = relations(orderItems, ({ one, many }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    exclusiones: many(exclusionsDetail),
}));

export const exclusionsDetail_Relations = relations(exclusionsDetail, ({ one }) => ({
    orderItem: one(orderItems, {
        fields: [exclusionsDetail.orderItemId],
        references: [orderItems.id],
    }),
}));