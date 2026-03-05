
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import { IReview } from "./Review.interface";
import ReviewModel from "./Review.model";
import mongoose from "mongoose";
import { IJwtPayload } from "../../../interface/jwt.interface";

const createReviewService = async ( payload: IReview) => {

    const review = await ReviewModel.create(payload);

    if(!review){
        throw new ApiError(500,"Failed to create new review.");
    }

    return review;
};


const getAllReviewService = async (userDetails:IJwtPayload,query: Record<string,unknown>) => {

    // const supplierId = String(userDetails.profileId);

    // const supplier = new mongoose.Types.ObjectId(supplierId);

    const allReviews = await ReviewModel.find({user: userDetails.userId})
            .sort({ createdAt: -1 }).lean();

    

    return allReviews;
};

const ReviewServices = { 
    createReviewService,
    getAllReviewService
 };
export default ReviewServices;