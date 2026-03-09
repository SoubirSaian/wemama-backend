import { add } from "winston";
import { z } from "zod";

        
const addMoodContent = z.object({
    body: z.object({
        mood: z.string().min(24, "Mood ID is required"),
        key: z.number().min(1, "Key must be a positive number"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
    }),
});

const MoodValidations = { 
    addMoodContent,
 };

export default MoodValidations;