import { apiCall } from '../utils/api';
import type { ApiResponse } from '../utils/api';
interface LoginResponse {
    token: string;
    refreshToken: string;
    email: string;
    userId: string;
    userToken: string;
}

export interface ImpersonateRequest {
    targetUserToken: string;
}

export interface ImpersonateResponse {
    token: string;
    refreshToken: string;
    userToken: string;
    email: string;
    isImpersonating: boolean;
}

const BASE_URL = "https://localhost:7279/auth";

export async function loginApi(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return apiCall<LoginResponse>(`${BASE_URL}/login`, {
        method: 'POST',
        body: { email, password },
        headers: { accept: 'application/json' },
        errorMode: "inline"
    });
}

export async function refreshTokenApi(refreshToken: string) {
    return apiCall<{ token: string; refreshToken: string }>(
        `${ BASE_URL }/refresh`,
        {
            method: 'POST',
            body: { refreshToken },
        }
    );
}

// Impersonate
export async function impersonateUser(
    data: ImpersonateRequest
): Promise<ApiResponse<ImpersonateResponse>> {
    return apiCall<ImpersonateResponse>(`${BASE_URL}/impersonate`, {
        method: "POST",
        body: data
    });
}

export async function stopImpersonation(): Promise<ApiResponse<LoginResponse>> {
    return apiCall<LoginResponse>(`${BASE_URL}/stop-impersonate`, {
        method: "POST"
    });
}
