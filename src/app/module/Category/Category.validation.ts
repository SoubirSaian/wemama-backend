import { z } from "zod";

const createCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(1,"Category name is required."),
        
    }),
});

const CategoryValidations = { 
    createCategoryValidation
 };
 
export default CategoryValidations;