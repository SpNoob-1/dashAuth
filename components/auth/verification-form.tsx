"use client";

import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useEffect, useCallback, useState, useRef } from "react";
import { FormSuccess } from "../form-succes";
import { Formerrors } from "../forn-erros";

function VerificationForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    // Evita que el useEffect se ejecute dos veces en modo desarrollo
    const hasFetched = useRef(false);

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (hasFetched.current) return;
        hasFetched.current = true;

        if (!token) {
            setError("Falta el token de verificación.");
            return;
        }

        fetch(`/api/v1/auth/verify?token=${token}`)
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Algo salió mal.");
                } else {
                    setSuccess(data.message || "¡Correo verificado con éxito!");
                }
            })
            .catch(() => {
                setError("Error al conectar con el servidor.");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Verifica tu correo electrónico"
            backButtonHref="/auth/login"
            backButtonLabel="Regresar al inicio"
        >
            <div className="flex flex-col items-center w-full justify-center gap-y-4">
                {!success && !error && <BeatLoader />}
                {success && (
                    <FormSuccess message={success} />
                )}
                {error && (
                    <Formerrors message={error} />
                )}
            </div>
        </CardWrapper>
    );
}

export default VerificationForm;