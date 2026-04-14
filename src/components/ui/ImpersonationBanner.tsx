import { useAuth } from "@/core/auth/authContext";
import { useTranslation } from "react-i18next";

export const ImpersonationBanner = () => {
    const { isImpersonating, impersonatedEmail } = useAuth();

    const { t } = useTranslation();

    if (!isImpersonating) return null;

    return (
        <div style={{
            width: "100%",
            backgroundColor: "#ffcc00",
            color: "#000",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            position: "fixed",
            top: 0,
            zIndex: 9999
        }}>
            ⚠️ {t("auth.Impersonated")}: <strong>{impersonatedEmail}</strong>
        </div>
    );
};