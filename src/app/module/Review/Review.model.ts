import { model, models, Schema } from "mongoose";
import { IReview } from "./Review.interface";

const ReviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    reviewerName: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

const ReviewModel = models.Review || model<IReview>("Review", ReviewSchema);

export default ReviewModel;