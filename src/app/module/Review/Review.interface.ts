import { Types } from "mongoose";

export interface IReview {
    user: Types.ObjectId;
    reviewerName :string;
    rating: number;
    description: string;
}