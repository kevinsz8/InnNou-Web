import { useState } from "react";
import { getHotels } from "@/services/hotelService";
import type { Hotel } from "@/types/hotel";

export const useHotels = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        previousPageNumber: 1,
        nextPageNumber: 1,
    });

    const [initialLoading, setInitialLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);



    const fetchHotels = async (
        page: number,
        search?: string,
        isNewSearch = false
    ) => {
        if (isNewSearch) {
            setInitialLoading(true);
        } else {
            setIsPageLoading(true);
        }

        const res = await getHotels({
            pageNumber: page,
            pageSize: 10,
            searchText: search
        });

        if (res.success) {
            setHotels(res.returnData.hotels);
            setPagination({
                pageNumber: res.returnData.pageNumber,
                totalPages: res.returnData.totalPages,
                hasPreviousPage: res.returnData.hasPreviousPage,
                hasNextPage: res.returnData.hasNextPage,
                previousPageNumber: res.returnData.previousPageNumber ?? 1,
                nextPageNumber: res.returnData.nextPageNumber ?? 1,
            });
        }

        setInitialLoading(false);
        setIsPageLoading(false);
    };

    return {
        hotels,
        pagination,
        initialLoading,
        isPageLoading,
        fetchHotels
    };
};