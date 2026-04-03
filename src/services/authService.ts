import { apiCall } from '../utils/api';
import type { ApiResponse } from '../utils/api';
interface LoginResponse {
    token: string;
    refreshToken: string;
    email: string;
    userId: string;
}

export async function loginApi(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return apiCall<LoginResponse>('https://localhost:7279/auth/login', {
        method: 'POST',
        body: { email, password },
        headers: { accept: 'application/json' },
        errorMode: "inline"
    });
}

export async function refreshTokenApi(refreshToken: string) {
    return apiCall<{ token: string; refreshToken: string }>(
        'https://localhost:7279/auth/refresh',
        {
            method: 'POST',
            body: { refreshToken },
        }
    );
}
