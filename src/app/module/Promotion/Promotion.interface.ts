import { Types } from "mongoose";

export interface INews {
    type: string
    title: string;
    description: string;
    image: string;
}

export interface IVideo {
    type: string
    title: string;
    description: string;
    video: string;
}