import { z } from "zod";

        
const createCommunity = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),   
    }),
});

const CommunityValidations = { 
    createCommunity 
};

export default CommunityValidations;