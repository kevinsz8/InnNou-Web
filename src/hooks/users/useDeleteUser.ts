import { useState } from "react";
import { deleteUser } from "@/services/userService";
import toast from "react-hot-toast";
import { t } from "i18next";

export const useDeleteUser = (onSuccess?: () => void) => {
    const [deleting, setDeleting] = useState(false);

    const remove = async (userToken: string) => {
        setDeleting(true);

        try {
            const res = await deleteUser(userToken);

            if (res.success) {
                toast.success(t("users.deleted") + " 🗑️");
                onSuccess?.();
            } else {
                toast.error(res.errors?.[0]?.description || t("users.deleteFailed"));
            }
        } finally {
            setDeleting(false);
        }
    };

    return { remove, deleting };
};