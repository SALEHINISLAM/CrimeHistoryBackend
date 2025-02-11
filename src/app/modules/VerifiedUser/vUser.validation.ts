import { z } from "zod";

const editProfileValidationSchema=z.object({
    body:z.object({
        profile_pic:z.string().optional(),
        bio:z.string().optional()
    })
})

export const VerifiedUserValidations={editProfileValidationSchema}