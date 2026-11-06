import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./db/schema";

// 1. Creamos el pool de conexiones con tu variable de entorno
const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

// 2. Exportamos 'db' una sola vez, pasándole el pool y el schema juntos
export const db = drizzle(pool, { schema });