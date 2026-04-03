import { handleApiError, type ErrorMode, type ApiError } from "./errorHandler";
import { refreshTokenApi } from "@/services/authService";

export interface ApiResponse<T> {
    returnData: T;
    errors?: ApiError[];
    success: boolean;
    statusCode?: number;
    timestamp?: string;
}

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const processQueue = () => {
    pendingRequests.forEach(cb => cb());
    pendingRequests = [];
};

export interface ApiOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    params?: Record<string, string | number>;

    //  NUEVO
    errorMode?: ErrorMode;
}

export async function apiCall<T = unknown>(
    url: string,
    options: ApiOptions = {},
    retry = true
): Promise<ApiResponse<T>> {

    const errorMode = options.errorMode ?? "toast";

    try {
        let fullUrl = url;

        if (options.params) {
            const query = new URLSearchParams(
                Object.entries(options.params).map(([k, v]) => [k, String(v)])
            ).toString();
            fullUrl += `?${query}`;
        }

        const token = localStorage.getItem("authToken");

        const fetchOptions: RequestInit = {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: options.body ? JSON.stringify(options.body) : undefined
        };

        const response = await fetch(fullUrl, fetchOptions);

        let data: ApiResponse<T>;

        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid JSON response");
        }

        //  TOKEN EXPIRED → REFRESH
        if (response.status === 401 && retry) {

            if (!isRefreshing) {
                isRefreshing = true;

                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    window.location.href = "/";
                    return Promise.reject();
                }

                try {
                    const refreshRes = await refreshTokenApi(refreshToken);

                    if (!refreshRes.success) throw new Error();

                    localStorage.setItem("authToken", refreshRes.returnData.token);
                    localStorage.setItem("refreshToken", refreshRes.returnData.refreshToken);

                    processQueue();
                } catch {
                    localStorage.clear();
                    window.location.href = "/";
                    return Promise.reject();
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                pendingRequests.push(async () => {
                    const result = await apiCall<T>(url, options, false);
                    resolve(result);
                });
            });
        }

        //  ERROR RESPONSE
        if (!response.ok || data.success === false) {
            const errors = handleApiError(data, errorMode);

            return {
                ...data,
                success: false,
                errors
            };
        }

        return data;

    } catch (error) {
        const errors = handleApiError(error, errorMode);

        return {
            returnData: null as any,
            success: false,
            errors
        };
    }
}