import express from "express"
import auth from "../../middleware/auth"
import { USER_ROLE } from "../User/user.constants"
import validateRequest from "../../middleware/validateRequest"
import { VerifiedUserController } from "./vUser.controller"
import { VerifiedUserValidations } from "./vUser.validation"

const router=express.Router()
router.patch("/edit-profile",auth(USER_ROLE.Admin,USER_ROLE.VerifiedUser,USER_ROLE.SuperAdmin),validateRequest(VerifiedUserValidations.editProfileValidationSchema),VerifiedUserController.editProfile)

export const VerifiedUserRoutes=router