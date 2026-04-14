import { useEffect, useState } from "react";
import { getHotels } from "@/services/hotelService";
import type { Hotel } from "../../types/hotel";

export const useGetHotels = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const res = await getHotels({
                pageNumber: 1,
                pageSize: 10,
            });


            if (res.success) {
                setHotels(res.returnData.hotels);
            }

            setLoading(false);
        };

        load();
    }, []);

    return {
        hotels,
        loading
    };
};