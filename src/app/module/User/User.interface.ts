import { Types } from "mongoose";

export interface IUser {
    auth: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    image: string[];
    location: object
    address: string;
    children: Date[];
    DOB: Date;
    state: string;
    city: string;
    country: string;
    bio: string;
    interesteds: string[];
    mumStage: string;
    subscription: {
        isSubscribed: boolean;
        subscribedAt: Date;
        expiredAt: Date;
    }
}





export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// export interface IUserRole {

// }