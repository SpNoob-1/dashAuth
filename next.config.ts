import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "external-content.duckduckgo.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
