// app/(protect)/roldemo/getdemo.tsx    

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormSuccess } from "@/components/form-succes";
import { Formerrors } from "@/components/forn-erros";

export default function Getdemo() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const onClick = async () => {

        const Response = await fetch("http://localhost:3000/api/v1/auth/admin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!Response.ok) {
            const data = await Response.json();
            setError(`Algo salió mal: ${data.error}`);
            return;
        }
        else {
            const data = await Response.json();
            setSuccess(`Datos obtenidos exitosamente: ${data.message}`);
        }
    }
    return (
        <div className="flex flex-col gap-y-2">
            <Button onClick={onClick} className="w-full">Obtener Datos</Button>
            {error && <Formerrors message={error} />}
            {success && <FormSuccess message={success} />}
        </div>
    );
}
