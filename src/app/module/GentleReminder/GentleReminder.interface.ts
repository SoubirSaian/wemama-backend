import { Types } from "mongoose";

export interface IGentleReminder {
    message: string;
    isActive: boolean;
    order: number;
}