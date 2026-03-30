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

const editMoodContent = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").optional(),
        description: z.string().min(1, "Description is required").optional(),
    }),
});

const addStreakMessageValidation = z.object({
    body: z.object({
        day: z.number().min(1, "Day is required"),
        message: z.string().min(1, "Description is required"),
    }),
});

const MoodValidations = { 
    addMoodContent,
    editMoodContent,
    addStreakMessageValidation
 };

export default MoodValidations;