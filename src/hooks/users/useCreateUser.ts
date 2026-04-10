import { useState } from "react";
import { createUser } from "@/services/userService";
import toast from "react-hot-toast";
import type { ApiResponse } from "@/utils/api";
import type { CreateUserResponse } from "@/services/userService";
import { t } from "i18next";

export const useCreateUser = (onSuccess?: () => void) => {
    const [saving, setSaving] = useState(false);

    const create = async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        username: string;
        roleId?: number | null;
        hotelId?: number | null;
    }): Promise<ApiResponse<CreateUserResponse>> => {
        setSaving(true);

        try {
            const res = await createUser(data);

            if (!res.success) {
                return res;
            }

            toast.success(t("users.created") + " 🎉");
            onSuccess?.();

            return res;
        } catch {
            const fallback = {
                returnData: null as any,
                success: false,
                errors: [
                    {
                        code: "UNEXPECTED",
                        description: "Unexpected error"
                    }
                ]
            };

            toast.error("Unexpected error");
            return fallback;
        } finally {
            setSaving(false);
        }
    };

    return {
        create,
        saving
    };
};