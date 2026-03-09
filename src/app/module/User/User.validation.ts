import { z } from "zod";

export const updateprofileValidation = z.object({
    body: z.object({
         name: z.string().min(1, "Name is required").optional(),
        DOB: z.date().min(1, "Date of birth is required").optional(),
        //  DOB: z.coerce.date().nullable().optional(),
        state: z.string().min(6, "state is required").optional(),
        city: z.string().min(6, "city is required").optional(),
        bio: z.string().min(6, "bio is required").optional(),
        children: z.array(z.string()).min(1, "At least one child is required").optional(),
        currentImages: z.array(z.string()).optional(),
    }),
});

export const completeProfileValidation = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        DOB: z.date().min(1, "Date of birth is required"),
        //  DOB: z.coerce.date().nullable().optional(),
        state: z.string().min(6, "state is required"),
        city: z.string().min(6, "city is required"),
        bio: z.string().min(6, "bio is required"),
        interesteds: z.array(z.string()).min(1, "At least one interest is required"),
        mumStage: z.string().min(6, "Mum stage is required"),
        phone: z.string().min(6, "Phone is required"),
    }),
});

export const addLocationValidation = z.object({
    body: z.object({
        // role: z.string().min(1, "Role is required"),
        location: z.string().min(1, "Location is required"),
        // userId: z.string().min(1, "userId is required"),
        // latitude: z.string().min(1, "Latitude is required"),
        // longitude: z.string().min(1, "Longitude is required"),
    }),
});

export const addBankDetailValidation = z.object({
    body: z.object({
        bankName: z.string().min(1, "Bank name is required"),
        accountName: z.string().min(1, "Account name is required"),
        accountNumber: z.string().min(1, "Account number is required"),
    }),
});

const changePasswordValidation = z.object({
    body: z.object({
        currentPassword: z.string().min(4,'Old password must be at least 4 characters'),
        newPassword: z.string().min(4, 'New password must be at least 4 characters'),
        confirmPassword: z.string().min(4, 'Confirm password must be at least 4 characters'),
        
      })
      // validate that password === confirmPassword
      .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
          message: "Password and confirm password must match",
          path: ["confirmPassword"],
        }
      ),
});

const UserValidations = { updateprofileValidation,completeProfileValidation ,addLocationValidation, addBankDetailValidation, changePasswordValidation };
export default UserValidations;