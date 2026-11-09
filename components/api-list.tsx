import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";

import { ApiAlert } from "./api-alert";


interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList = ({ entityName, entityIdName }: ApiListProps) => {
    const origin = useOrigin();
    const baseUrl = `${origin}/api/v1/admin`;

    return (
        <div>

            <ApiAlert
                title="METHOD"
                description={`${baseUrl}/${entityName}`}
                variant="public"
            />
            <ApiAlert
                title="METHOD"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant="public"
            />
        </div>
    )
}
