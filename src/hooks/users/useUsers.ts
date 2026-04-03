import { useState } from "react";
import { getUsers } from "@/services/userService";
import type { User } from "@/types/user"; // (lo creamos luego)

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [pagination, setPagination] = useState({
        pageNumber: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        previousPageNumber: 1,
        nextPageNumber: 1,
    });

    const fetchUsers = async (
        page: number,
        searchField: string,
        searchText: string,
        isInitial = false
    ) => {
        if (isInitial) setInitialLoading(true);
        else setIsPageLoading(true);

        const res = await getUsers({
            pageNumber: page,
            pageSize: 10,
            searchField,
            searchText,
        });

        setUsers(res.returnData.users);

        setPagination({
            pageNumber: res.returnData.pageNumber,
            totalPages: res.returnData.totalPages,
            hasPreviousPage: res.returnData.hasPreviousPage,
            hasNextPage: res.returnData.hasNextPage,
            previousPageNumber: res.returnData.previousPageNumber ?? 1,
            nextPageNumber: res.returnData.nextPageNumber ?? 1,
        });

        setInitialLoading(false);
        setIsPageLoading(false);
    };

    return {
        users,
        pagination,
        initialLoading,
        isPageLoading,
        fetchUsers,
    };
};