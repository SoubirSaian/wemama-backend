import { z } from "zod";
import { da } from "zod/v4/locales";

        
const expertRegistrationValidation = z.object({
    body: z.object({
        email: z.string().min(4,'Valid Email id requered'),
        role: z.string().min(1,'Role id requered'),
        password: z.string().min(4, 'New password must be at least 4 characters'),
        confirmPassword: z.string().min(4, 'Confirm password must be at least 4 characters'),
        
      })
      // validate that password === confirmPassword
      .refine(
        (data) => data.password === data.confirmPassword,
        {
          message: "Password and confirm password must match",
          path: ["confirmPassword"],
        }
      ),
});


export const expertValidationSchema = z.object({
    body: z.object({

        name: z.string().min(1, "Name is required"),
      
        phone: z.string().min(5, "Phone number is required"),
      
        email: z.string().email("Invalid email address"),
      
        country: z.string().min(1, "Country is required"),
      
        city: z.string().min(1, "City is required"),
      
        profession: z.object({
          designation: z.string().min(1, "Designation is required"),
          title: z.string().min(1, "Title is required"),
          experience: z.number().min(0, "Experience cannot be negative"),
        }),
      
        license: z.object({
          qualification: z.string().min(1, "Qualification is required"),
          number: z.string().min(1, "License number is required"),
          proof: z.string().min(1, "License proof is required"),
        }),
      
        session: z.object({
          topic: z.string().min(1, "Session topic is required"),
          format: z.string().min(1, "Session format is required"),
          length: z.string().min(1, "Session length is required"),
        }),
      
        availability: z.object({
          day: z.string().min(1, "Available day is required"),
          time: z.string().min(1, "Available time is required"),
        }),
    })
});

export const sessionValidationSchema = z.object({
    body: z.object({

        expert: z.string().min(24, "Expert id is required"),
      
        status: z.string().min(5, "Session status is required").optional(),
      
        title: z.string().min(1, "Title is required"),
      
        description: z.string().min(1, "Description is required"),

        date: z.string().min(1, "Session date is required"),

        time: z.string().min(1, "Session time is required"),
      
    })
});



const ExpertValidations = { 
    expertRegistrationValidation,
    expertValidationSchema,
    sessionValidationSchema
 };

export default ExpertValidations;