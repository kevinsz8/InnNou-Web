import { apiCall } from "@/utils/api";
import type { ApiResponse } from "@/utils/api";
import type { Hotel } from "../types/hotel";



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
    searchField?: string;
    searchText?: string;
}

const BASE_URL = "https://localhost:7279/hotels";

export async function getHotels(request: GetHotelsRequest): Promise<ApiResponse<GetHotelsResponse>> {
    return apiCall<GetHotelsResponse>(`${BASE_URL}/getHotels`, {
        method: "POST",
        errorMode: "silent",
        body: request,
    });
}