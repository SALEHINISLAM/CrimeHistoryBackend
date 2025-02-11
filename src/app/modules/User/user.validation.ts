import { z } from "zod";

// Define USER_ROLE as a Zod enum
const USER_ROLE = z.enum(["SuperAdmin", "Admin", "VerifiedUser", "UnVerifiedUser"]);

// Define the TUser Zod schema
const createUserValidationSchema = z.object({
    body: z.object({
        user_id: z.string().optional(),
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        }).email("Invalid email format").optional(),
        role: USER_ROLE.default("UnVerifiedUser"),
        password: z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }).min(
            6,
            "Password must be at least 6 characters long"
        ).max(
            32,
            "Password must be less than 32 character"
        ),
        needs_password_change: z.boolean().default(false),
        passwordChangedAt: z.date().optional(),
        phone_number: z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string",
        }).regex(/^\d{11}$/, "Phone number must be 11 digits"),
        is_verified: z.boolean({
            required_error: "is_verified is required",
            invalid_type_error: "is_verified must be a boolean",
        }).default(false),
        is_banned: z.boolean({
            required_error: "is_banned is required",
            invalid_type_error: "is_banned must be a boolean",
        }).default(false),
    })
});

const verifyCodeValidationSchema = z.object({
    body: z.object({
        code: z.number({ required_error: "Verification code is required." })
    })
})

const resetPasswordValidationSchema = z.object({
    body: z.object({
        password: z.string({ required_error: "Password is required." }),
        code: z.number({ required_error: "Verification code is required." })
    })
})

export const UserValidation = { createUserValidationSchema, verifyCodeValidationSchema, resetPasswordValidationSchema }