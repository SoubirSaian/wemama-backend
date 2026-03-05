import { z } from "zod";

const createLatestNews = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        // address: z.string().optional(),
    }),
});

const createLatestvideo = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        // address: z.string().optional(),
    }),
});

const PromotionValidations = { 
    createLatestNews
 };
export default PromotionValidations;