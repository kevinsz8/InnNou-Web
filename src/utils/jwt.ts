export interface JwtPayload {
    sub?: string;
    email?: string;
    roleLevel?: string | number;
    hotelId?: string | number;
    impersonatedUserToken?: string;
    exp?: number;
    iat?: number;
}

export interface AuthUser {
    actorUserToken: string | null;
    effectiveUserToken: string | null;
    email: string | null;
    roleLevel: number;
    hotelId: number | null;
    isImpersonating: boolean;
}

const parseBase64Url = (value: string) => {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return atob(padded);
};

export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = parseBase64Url(parts[1]);
        return JSON.parse(payload) as JwtPayload;
    } catch {
        return null;
    }
};

export const getAuthUserFromToken = (token: string | null): AuthUser | null => {
    if (!token) return null;

    const payload = decodeJwt(token);
    if (!payload) return null;

    const actorUserToken = payload.sub ?? null;
    const effectiveUserToken = payload.impersonatedUserToken ?? payload.sub ?? null;
    const email = payload.email ?? null;
    const roleLevel = Number(payload.roleLevel ?? 0);
    const hotelIdRaw = payload.hotelId;
    const hotelId = hotelIdRaw !== undefined && hotelIdRaw !== null ? Number(hotelIdRaw) : null;

    return {
        actorUserToken,
        effectiveUserToken,
        email,
        roleLevel,
        hotelId,
        isImpersonating: !!payload.impersonatedUserToken
    };
};

export const getRoleNameFromLevel = (roleLevel: number) => {
    if (roleLevel >= 100) return "SuperAdmin";
    if (roleLevel >= 80) return "Admin";
    if (roleLevel >= 50) return "Manager";
    return "User";
};