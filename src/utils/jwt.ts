import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
    sub: string;
    email: string;
    roleLevel: string;
    hotelId?: string;
    impersonatedUserToken?: string;
    actorRoleLevel?: string;
    actorHotelId?: string;
    impersonatedEmail: string;
}

export interface AuthUser {
    actorUserToken: string | null;
    effectiveUserToken: string | null;
    email: string | null;
    roleLevel: number;
    hotelId: number | null;
    isImpersonating: boolean;
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch {
        return null;
    }
}

export const getAuthUserFromToken = (token: string | null): AuthUser | null => {
    if (!token) return null;

    const payload = decodeToken(token);
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