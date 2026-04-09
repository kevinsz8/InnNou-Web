import { apiCall } from "@/utils/api";
import type { ApiResponse } from "@/utils/api";

export interface Hotel {
    hotelId: number;
    name: string;
}

export interface GetHotelsResponse {
    hotels: Hotel[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber?: number;
    previousPageNumber?: number;
}

export interface GetHotelsRequest {
    pageNumber: number;
    pageSize: number;
}

const BASE_URL = "https://localhost:7279/hotels";

export async function getHotelsSimple(request: GetHotelsRequest): Promise<ApiResponse<GetHotelsResponse>> {
    return apiCall<GetHotelsResponse>(`${BASE_URL}/getHotels`, {
        method: "POST",
        errorMode: "silent",
        body: request,
    });
}