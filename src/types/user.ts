export interface User {
    userId: string;
    userToken: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    hotelId?: number;
    roleId?: number;
}