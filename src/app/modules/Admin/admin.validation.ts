import { z } from "zod";

const bannedCrimeValidationSchema=z.object({
    body:z.object({
        report_id:z.string({required_error:"report_id required"})
    })
})

export const AdminValidations={bannedCrimeValidationSchema}