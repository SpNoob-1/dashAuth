import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**", // Permite cualquier ruta dentro del dominio
            },
        ],
    },
};

export default nextConfig;
