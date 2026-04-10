import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/core/auth/authContext";
import { impersonateUser } from "../../services/authService";

export const useImpersonateUser = () => {
    const [loading, setLoading] = useState(false);
    const { updateSession } = useAuth();

    const impersonate = async (targetUserToken: string) => {
        setLoading(true);

        try {
            const res = await impersonateUser({ targetUserToken });

            if (!res.success) {
                //toast.error("Cannot impersonate user");
                setLoading(false);
                return res;
            }

            updateSession(
                res.returnData.token,
                res.returnData.refreshToken
            );

            // Timing just to give the user be able to read message 
            setTimeout(() => {
                window.location.reload();
            }, 2000);

            return res;

        } catch {
            toast.error("Unexpected error");
            setLoading(false);
        }
    };

    return {
        impersonate,
        loading
    };
};