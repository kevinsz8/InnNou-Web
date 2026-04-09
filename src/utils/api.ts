import { forceLogout } from "./authSession";
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
let pendingRequests: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error?: unknown) => {
    pendingRequests.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(null);
        }
    });

    pendingRequests = [];
};

export interface ApiOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    params?: Record<string, string | number>;

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

        const token = localStorage.getItem('authToken');

        const fetchOptions: RequestInit = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        };

        const response = await fetch(fullUrl, fetchOptions);

        let data: ApiResponse<T>;

        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid JSON response");
        }

        // TOKEN EXPIRED  REFRESH FLOW
        if (response.status === 401) {

            if (!retry) {
                forceLogout();
                return Promise.reject(new Error("Session expired"));
            }

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                forceLogout();
                return Promise.reject(new Error("Session expired"));
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({ resolve, reject });
                }).then(() => apiCall<T>(url, options, false));
            }

            isRefreshing = true;

            try {
                const refreshRes = await refreshTokenApi(refreshToken);

                if (!refreshRes.success || !refreshRes.returnData?.token) {
                    throw new Error("Refresh token failed");
                }

                localStorage.setItem("authToken", refreshRes.returnData.token);
                localStorage.setItem("refreshToken", refreshRes.returnData.refreshToken);

                processQueue();

                return await apiCall<T>(url, options, false);

            } catch (refreshError) {
                processQueue(refreshError);
                forceLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }


        if (!response.ok || data.success === false) {
            handleApiError(data, errorMode);
        }

        return data;

    } catch (error) {
        handleApiError(error, errorMode);

        return {
            returnData: null as any,
            success: false,
            errors: [{ code: "UNEXPECTED", description: "Unexpected error" }]
        };
    }
}