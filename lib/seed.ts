import { db } from "../index";
import { ordersStates } from "@/db/schema";

async function main() {
    const estadosBase = [
        { nombre: "PENDIENTE", esFinal: false },
        { nombre: "EN_PREPARACION", esFinal: false },
        { nombre: "LISTO", esFinal: false },
        { nombre: "ENTREGADO", esFinal: true },
        { nombre: "CANCELADO", esFinal: true },
    ];

    for (const estado of estadosBase) {
        await db
            .insert(ordersStates)
            .values(estado)
            .onConflictDoUpdate({
                target: ordersStates.nombre,
                set: { esFinal: estado.esFinal },
            });
    }

    console.log("¡Seeders de estados de pedido ejecutados correctamente!");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Error al ejecutar los seeders:", err);
        process.exit(1);
    });