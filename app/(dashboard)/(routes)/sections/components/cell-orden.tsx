"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { SectionColumns } from "../[sectionid]/components/columns";

interface CellOrdenProps {
    section: SectionColumns;
    index: number;
    onMove: (index: number, direction: "up" | "down") => void;
    disabled: boolean;
}

export function CellOrden({ section, index, onMove, disabled }: CellOrdenProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium w-6 text-center">{section.order}</span>
            <ButtonGroup
                orientation="vertical"
                aria-label="Controles de orden"
                className="h-fit"
            >
                <Button
                    variant="outline"
                    size="icon-xs"
                    disabled={disabled || index === 0}
                    onClick={() => onMove(index, "up")}
                    type="button"
                >
                    <PlusIcon className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="icon-xs"
                    disabled={disabled}
                    onClick={() => onMove(index, "down")}
                    type="button"
                >
                    <MinusIcon className="h-3 w-3" />
                </Button>
            </ButtonGroup>
        </div>
    );
}