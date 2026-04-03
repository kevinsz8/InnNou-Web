import { useState } from "react";
import { updateUser } from "@/services/userService";
import toast from "react-hot-toast";

export const useUpdateUser = (onSuccess?: () => void) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (data: any) => {
        setSaving(true);
        setError(null);

        try {
            const res = await updateUser(data);

            if (res.success) {
                toast.success("User updated ✨");
                onSuccess?.();
            } else {
                const msg = res.errors?.[0]?.description || "Update failed";
                setError(msg);
                toast.error(msg);
            }
        } finally {
            setSaving(false);
        }
    };

    return { update, saving, error };
};