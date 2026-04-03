import toast from "react-hot-toast";
import { showGlobalErrorModal } from "../core/auth/errorModalService";

export type ErrorMode = "toast" | "inline" | "silent" | "modal";

export interface ApiError {
    code: string;
    description: string;
}

export const handleApiError = (
    error: any,
    mode: ErrorMode = "toast"
): ApiError[] => {

    let normalizedErrors: ApiError[] = [];

    //  Backend error (ApiResponse)
    if (error?.errors?.length) {
        normalizedErrors = error.errors;
    }
    //  JS / network error
    else if (error instanceof Error) {
        normalizedErrors = [
            { code: "ERROR", description: error.message }
        ];
    }
    //  fallback
    else {
        normalizedErrors = [
            { code: "UNKNOWN", description: "Unexpected error" }
        ];
    }

    //  UI handling
    switch (mode) {

        case "toast":
            normalizedErrors.forEach(e => toast.error(e.description));
            break;

        case "modal":
            showGlobalErrorModal(normalizedErrors[0]?.description || "Unexpected error");
            break;

        case "inline":
            // handled in form
            break;

        case "silent":
            // handled in form
            break;
    }

    return normalizedErrors;
};