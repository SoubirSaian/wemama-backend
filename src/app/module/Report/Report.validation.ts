import { z } from "zod";

        
const reportValidationSchema = z.object({
    body: z.object({
        report: z.string().min(24,"User / Post Id is required."),
        name: z.string().min(24,"Report name is required."),
        type: z.string().min(24,"User / Post Is is required."),
        // content: z.string().min(24,"User / Post Is is required.")
        
    }),
});

const ReportValidations = { 
    reportValidationSchema
 };

export default ReportValidations;