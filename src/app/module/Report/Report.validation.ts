import { z } from "zod";

        
const reportValidationSchema = z.object({
    body: z.object({
        report: z.string().min(24,"User / Post Id is required."),
        name: z.string().min(1,"Report name is required."),
        type: z.string().min(1,"Report type Is is required."),
        note: z.string().min(1,"Note is required.").optional()
        
    }),
});

const ReportValidations = { 
    reportValidationSchema
 };

export default ReportValidations;