import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorsProps {
    message?: string;
}

export const Formerrors = ({ message }: FormErrorsProps) => {

    if (!message) return null;

    return (
        <div className="flex items-center gap-x-2 rounded-md border border-red-200/60 bg-red-50/70 px-2 py-1 text-xs/relaxed text-red-600 shadow-sm">
            <FaExclamationTriangle className="size-4 shrink-0" />
            <span className="sr-only">Error</span>
            <span aria-hidden="false">
                {message}
            </span>
        </div>
    );
}