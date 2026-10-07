import { Poppins } from "next/font/google";
import { Lock } from 'lucide-react';
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2  items-centerjustify-center ">
            <h1 className={cn("text-3xl font-semibold flex", font.className)}>
                <Lock size={40} /> Auth
            </h1>
            <p className="text-muted-foreground text-sm ml-2">{label}</p>
        </div>
    )
}