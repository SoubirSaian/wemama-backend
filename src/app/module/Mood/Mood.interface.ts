import { Types } from "mongoose";

export interface IMood {
    title: string;    
    image: string;
    key?: number;
}

export interface IMoodContent {
    mood: Types.ObjectId;
    key?: number;
    title: string;    
    description: string;
}