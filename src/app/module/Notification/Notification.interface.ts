import { Types } from "mongoose";

export interface INotification {
    toId : Types.ObjectId;
    title :string;
    // details: string;  
}

export interface IAdminNotification {
    title :string;
    // details: string;  
}

export type INotificationPayload = {
    toId?: string;   // optional field
    title: string;
};
