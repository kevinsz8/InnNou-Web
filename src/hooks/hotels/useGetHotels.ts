import { useEffect, useState } from "react";
import { getHotelsSimple, type Hotel } from "@/services/hotelService";

export const useGetHotels = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const res = await getHotelsSimple({
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