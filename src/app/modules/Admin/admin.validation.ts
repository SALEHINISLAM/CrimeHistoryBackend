import { z } from "zod";

const bannedCrimeValidationSchema=z.object({
    body:z.object({
        report_id:z.string({required_error:"report_id required"})
    })
})

const banUserValidationSchema=z.object({
    body:z.object({
        email:z.string({required_error:"User email is required"})
    })
})

export const AdminValidations={bannedCrimeValidationSchema,banUserValidationSchema}