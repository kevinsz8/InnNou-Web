import { useState } from "react";
import { deleteUser } from "@/services/userService";
import toast from "react-hot-toast";

export const useDeleteUser = (onSuccess?: () => void) => {
    const [deleting, setDeleting] = useState(false);

    const remove = async (userId: string) => {
        setDeleting(true);

        try {
            const res = await deleteUser(userId);

            if (res.success) {
                toast.success("User deleted 🗑️");
                onSuccess?.();
            } else {
                toast.error(res.errors?.[0]?.description || "Delete failed");
            }
        } finally {
            setDeleting(false);
        }
    };

    return { remove, deleting };
};