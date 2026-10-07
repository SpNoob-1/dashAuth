import { CiCircleCheck } from "react-icons/ci";

interface FormErrorsProps {
    message?: string;
}

export const FormSuccess = ({ message }: FormErrorsProps) => {

    if (!message) return null;

    return (
        <div className="flex items-center gap-x-2 rounded-md border border-green-200/60 bg-green-50/70 px-2 py-1 text-xs/relaxed text-green-600 shadow-sm">
            <CiCircleCheck className="size-4 shrink-0" />
            <span className="sr-only">Exito</span>
            <span aria-hidden="false">
                {message}
            </span>
        </div>
    );
}