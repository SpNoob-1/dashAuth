// app/(protect)/client/getclientprofile.tsx`
"use client"
import { useState } from "react";

interface ClientProps {
    user: {
        sub?: string;
        name?: string;
        email?: string;
        rol?: string;
    } | null;
}

export default function GetClientProfile({ user }: ClientProps) {

    const [isExpanded, setIsExpanded] = useState(false);

    if (!user) return <p>No autenticado</p>;

    return (
        <div className="p-4 border rounded-lg">
            <p>Bienvenido, <strong>{user?.name}</strong></p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 px-4 py-2 bg-black text-white rounded"
            >
                {isExpanded ? "Ocultar detalles" : "Ver detalles"}
            </button>

            {isExpanded && (
                <p className="mt-2 text-sm text-gray-600">Email: {user.email} | Rol: {user.rol}</p>
            )}
        </div>
    );
}
