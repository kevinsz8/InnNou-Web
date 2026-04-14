import { useEffect, useState } from "react";
import { getRolesSimple } from "@/services/roleService";
import type { Role } from "../../types/role";

export const useGetRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const res = await getRolesSimple({
                pageNumber: 1,
                pageSize: 10,
});

            if (res.success) {
                setRoles(res.returnData.roles);
            }

            setLoading(false);
        };

        load();
    }, []);

    return {
        roles,
        loading
    };
};