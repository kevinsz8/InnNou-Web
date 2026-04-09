import { apiCall } from '@/utils/api';
import type { ApiResponse } from '@/utils/api';

export interface User {
    userId: string;
    userToken: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
}

export interface GetUsersQueryResponse {
    users: User[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber?: number;
    previousPageNumber?: number;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface CreateUserResponse {
    userId: string;
    email: string;
}

export interface GetUsersRequest {
    pageNumber: number;
    pageSize: number;
    searchField?: string;
    searchText?: string;
}

export interface UpdateUserRequest {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    userName: string;
}

const BASE_URL = "https://localhost:7279/users";

export async function updateUser(data: UpdateUserRequest) {
    return apiCall(`${BASE_URL}/editUser`, {
        method: 'POST',
        body: data
    });
}

export async function deleteUser(userToken: string) {
    return apiCall(`${BASE_URL}/deleteUser`, {
        method: 'POST',
        body: { userToken }
    });
}



//  GET USERS
export async function getUsers(
    request: GetUsersRequest
): Promise<ApiResponse<GetUsersQueryResponse>> {
    return apiCall<GetUsersQueryResponse>(`${BASE_URL}/getUsers`, {
        method: 'POST',
        headers: {
            accept: 'application/json'
        },
        body: request,
    });
}

//  CREATE USER
export async function createUser(
    data: CreateUserRequest
): Promise<ApiResponse<CreateUserResponse>> {
    return apiCall<CreateUserResponse>(`${BASE_URL}/createUser`, {
        method: 'POST',
        headers: {
            accept: 'application/json'
        },
        body: data,
        errorMode: "inline"
    });
}

