import { z } from "zod";


export const childrenValidationSchema = z.array(
  z.object({
    gender: z
      .enum(["Male", "Female", "Other"])
      .default("Male"),

    dob: z
      .coerce
      .date({
        message: "Child date of birth is required"
      })
      .max(new Date(), "Child date of birth cannot be in the future")
      .default(new Date())
  })
).optional();

export const updateprofileValidation = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required").optional(),
        DOB: z.coerce.date({message: "Date of birth is required"}).max(new Date(), "Date of birth cannot be in the future").optional(),
        children: childrenValidationSchema,
        //  DOB: z.coerce.date().nullable().optional(),
        state: z.string().min(6, "state is required").optional(),
        city: z.string().min(6, "city is required").optional(),
        bio: z.string().min(6, "bio is required").optional(),
        currentImages: z.array(z.string()).optional(),
    }),
});

export const completeProfileValidation = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        DOB: z.coerce
        .date({
            message: "Date of birth is required"
        }).max(new Date(), "Date of birth cannot be in the future"),
        //  DOB: z.coerce.date().nullable().optional(),
        state: z.string().min(1, "state is required"),
        city: z.string().min(1, "city is required"),
        bio: z.string().min(1, "bio is required").optional(),
        interesteds: z
            .array(z.string())
            .min(3, "At least 3 interests are required")
            .max(10, "Maximum 10 interests can be added"),
        mumStage: z.string().min(1, "Mum stage is required"),
        phone: z.string().min(1, "Phone is required"),
    }),
});


export const addLocationValidation = z.object({
  body: z.object({
    address: z
      .string()
      .min(1, "Address is required")
      .optional(),

    latitude: z.coerce
      .number()
      .min(-90, "Latitude must be greater than or equal to -90")
      .max(90, "Latitude must be less than or equal to 90"),

    longitude: z.coerce
      .number()
      .min(-180, "Longitude must be greater than or equal to -180")
      .max(180, "Longitude must be less than or equal to 180"),
  }),
});

export const searchUserQueryValidation = z.object({
  query: z.object({

    latitude: z.coerce
      .number()
      .min(-90, "Latitude must be greater than or equal to -90")
      .max(90, "Latitude must be less than or equal to 90"),

    longitude: z.coerce
      .number()
      .min(-180, "Longitude must be greater than or equal to -180")
      .max(180, "Longitude must be less than or equal to 180"),
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

const UserValidations = { updateprofileValidation,completeProfileValidation ,addLocationValidation,searchUserQueryValidation, addBankDetailValidation, changePasswordValidation };
export default UserValidations;