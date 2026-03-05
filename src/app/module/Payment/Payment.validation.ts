import { z } from "zod";

const CreatePaymentSchemaValidation = z.object({
    body: z.object({

        email: z
          .string()
          .email("Invalid email format"),
      
        amount: z
          .number()
          .positive("Amount must be a positive number"),
      
        metadata: z.object({
          orderId: z.string().nonempty("Metadata orderId is required"),
          profileId: z.string().nonempty("Metadata profileId is required"),
        }),
      
      //   profileId: z.string().nonempty("profileId is required"),
      
      //   orderId: z.string().nonempty("orderId is required"),
    })
});

const PaymentValidations = { 
    CreatePaymentSchemaValidation
 };

export default PaymentValidations;