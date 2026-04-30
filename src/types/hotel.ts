export interface Hotel {
    hotelId: number;
    hotelToken: string;
    name: string;
    parentHotelId: number | null;
    isActive: boolean;
}