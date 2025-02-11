import { z } from "zod";

// Zod validation schema for Crime
const createCrimeValidationSchema = z.object({
    body: z.object({
        report_id: z.string().uuid().optional(),  // Validate as a UUID string
        user_id: z.string().optional(),  // Ensure user_id is a non-empty string
        title: z.string().min(1, "Title is required"),  // Ensure title is non-empty
        description: z.string().min(1, "Description is required"),  // Ensure description is non-empty
        division: z.string().min(1, "Division is required"),  // Ensure division is non-empty
        district: z.string().min(1, "District is required"),  // Ensure district is non-empty
        crime_time: z.number(),  // Ensure crime_time is a valid Date
        image_urls: z.array(z.string().url()).optional(),  // image_urls is an optional array of strings
        video_url: z.string().url().optional(),  // video_url is an optional string
        verification_score: z.number().default(0),  // Default to 0 if not provided
        is_banned: z.boolean().default(false),  // Default to false if not provided
    })
});
const updateCrimeValidationSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").optional(),  // Ensure title is non-empty
        description: z.string().min(1, "Description is required").optional(),  // Ensure description is non-empty
        division: z.string().min(1, "Division is required").optional(),  // Ensure division is non-empty
        district: z.string().min(1, "District is required").optional(),  // Ensure district is non-empty
        crime_time: z.number().optional(),  // Ensure crime_time is a valid Date
        image_urls: z.array(z.string().url()).optional(),  // image_urls is an optional array of strings
        video_url: z.string().url().optional(),  // video_url is an optional string
    })
});

export const crimeValidations = { createCrimeValidationSchema,updateCrimeValidationSchema }

