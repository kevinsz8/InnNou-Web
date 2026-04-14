import { apiCall } from "@/utils/api";
import type { ApiResponse } from "@/utils/api";
import type { Role } from "../types/role";

export interface GetRolesRequest {
    pageNumber: number;
    pageSize: number;
}

export interface GetRolesResponse {
    roles: Role[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber?: number;
    previousPageNumber?: number;
}

const BASE_URL = "https://localhost:7279/roles";

export async function getRolesSimple(request: GetRolesRequest): Promise<ApiResponse<GetRolesResponse>> {
    return apiCall<GetRolesResponse>(`${BASE_URL}/getRoles`, {
        method: "POST",
        errorMode: "silent",
        body: request,
    });
}