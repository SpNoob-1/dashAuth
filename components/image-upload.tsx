"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        // Verifica la estructura del evento devuelto por Cloudinary
        if (result?.info?.secure_url) {
            onChange(result.info.secure_url);
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            {/* Vista previa de las imágenes subidas */}
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div
                        key={url}
                        className="relative w-48 h-48 rounded-md overflow-hidden border"
                    >
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon-lg"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Imagen del producto"
                            src={url}
                        />
                    </div>
                ))}
            </div>

            {/* Widget de subida de Cloudinary */}
            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset="jknrkaar"
                options={{
                    multiple: true, // 🟢 Permite seleccionar varias imágenes juntas
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Subir imagen
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};