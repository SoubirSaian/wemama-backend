import { z } from "zod";
import {
  ENUM_POST_PRIORITY,
  ENUM_POST_SIZE,
  ENUM_POST_STATUS,
} from "../../../utilities/enum";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid MongoDB ObjectId");

const coordinatesSchema = z
  .array(z.number())
  .length(2, "Coordinates must be [longitude, latitude]");

const geoLocationZodSchema = z.object({
  type: z.literal("Point").default("Point"),

  coordinates: coordinatesSchema,

  address: z
    .string()
    .min(1, "Address is required"),
});




const postZodSchema = z.object({
    body: z.object({

        // creator: objectIdSchema, // required
      
        // bearer: objectIdSchema.optional(),
      
        status: z
          .enum(ENUM_POST_STATUS)
          .optional()
          .default(ENUM_POST_STATUS.PENDING),
      
        priority: z
          .enum(ENUM_POST_PRIORITY)
          .optional()
          .default(ENUM_POST_PRIORITY.URGENT),
      
        size: z
          .enum(ENUM_POST_SIZE)
          .optional()
          .default(ENUM_POST_SIZE.SMALL),
      
        title: z
          .string().min(1, "Post title required."),
      
        description: z
          .string().min(1, "Post description required."),
      
        images: z
          .array(z.string())
          .optional()
          .default([]),
      
        pickUpLocation: geoLocationZodSchema.optional(),
      
        dropLocation: geoLocationZodSchema.optional(),
      
        category: z.string().optional(),
      
        price: z.number().optional(),
      
        deliveryDate: z.coerce.date().optional(),
      
        deliveryTime: z.coerce.date().optional(),
    }),
});

const getAllPostsZodSchema = z.object({
    query: z.object({
        status: z.enum(ENUM_POST_STATUS).optional(),
    }),
});

const getNearbyPostsZodSchema = z.object({
    query: z.object({
        // status: z.enum(ENUM_POST_STATUS).optional(),
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number(),
    }),
});

const PostValidation = { postZodSchema, getAllPostsZodSchema, getNearbyPostsZodSchema };

export default PostValidation;
