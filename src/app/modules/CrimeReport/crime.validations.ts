import { optional, z } from "zod";

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
        is_banned: z.boolean().default(false),
        is_anonymous: z.boolean().default(false)
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

const createCommentValidationSchema = z.object({
    body: z.object({
        comment_id: z.string().uuid().optional(), // Ensure it's a valid UUID
        user_id: z.string().min(1, { message: "User ID is required" }).optional(), // Ensure it's not empty
        comment: z.string().min(1, { message: "Comment text is required" }), // Ensure it's not empty
        proof_image_urls: z.array(z.string().url({ message: "Invalid URL format" })).default([]), // Ensure URLs are valid
    })
})

const updateCommentValidationSchema = z.object({
    body: z.object({
        comment_id: z.string().uuid().optional(),
        user_id: z.string().min(1, { message: "User ID is required" }).optional(),
        comment: z.string().min(1, { message: "Comment text is required" }).optional(),
        proof_image_urls: z.array(z.string().url({ message: "Invalid URL format" })).default([]).optional(),
    })
})

const voteValidationSchema = z.object({
    body: z.object({
        vote_type: z.enum(["upVote", "downVote", "noVote"], {
            required_error: "Vote type is required.",
            invalid_type_error: "Vote type must be 'upvote', 'downvote', or 'noVote'.",
        }),
    }),
});

export const crimeValidations = { createCrimeValidationSchema, updateCrimeValidationSchema, createCommentValidationSchema, updateCommentValidationSchema, voteValidationSchema }

