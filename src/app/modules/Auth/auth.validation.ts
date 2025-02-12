import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: "Email is required" }).email(),
        password: z.string({ required_error: "Password is required" })
    })
})

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: "Refresh token is required."
        })
    })
})

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: 'Old password is required',
        }),
        newPassword: z.string({ required_error: 'Password is required' }),
    }),
});

const createAdminValidationSchema=z.object({
    body:z.object({
        email:z.string({required_error:"User email is required"})
    })
})
const removeAdminValidationSchema=z.object({
    body:z.object({
        email:z.string({required_error:"User email is required"})
    })
})



export const AuthValidationSchema = { loginValidationSchema, refreshTokenValidationSchema ,changePasswordValidationSchema,createAdminValidationSchema,removeAdminValidationSchema}