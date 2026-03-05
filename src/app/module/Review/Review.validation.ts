import { z } from "zod";

const createReviewValidation = z.object({
    body: z.object({
        user: z.string().min(1,"user id is required"),
        reviewerName: z.string().min(1,"Reviewer name is required"),
        rating: z.number().positive(),
        description: z.string().min(1,"Review description is required")
        
    }),
});

const getAllReviewValidation = z.object({
    query: z.object({
        supplier: z.string().min(1,"user id is required"),
        
    }),
});

const ReviewValidations = { 
    createReviewValidation,
    getAllReviewValidation
 };
export default ReviewValidations;