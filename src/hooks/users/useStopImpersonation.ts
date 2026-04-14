import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/core/auth/authContext";
import { stopImpersonation } from "../../services/authService";

export const useStopImpersonation = () => {
    const [loading, setLoading] = useState(false);
    const { updateSession } = useAuth();

    const stop = async () => {
        setLoading(true);

        try {
            const res = await stopImpersonation();

            if (!res.success) {
                toast.error("Unable to stop impersonation");
                setLoading(false);
                return;
            }

            updateSession(
                res.returnData.token,
                res.returnData.refreshToken
            );

            

            setTimeout(() => {
                window.location.reload();
            }, 2000);

            toast.success("Returned to your account");

            return res;

        } catch {
            toast.error("Unexpected error");
            setLoading(false);
        }
    };

    return {
        stop,
        loading
    };
};