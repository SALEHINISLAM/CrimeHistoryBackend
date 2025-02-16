import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';
import { userServices } from './user.service';

const router=express.Router()

router.post('/register',validateRequest(UserValidation.createUserValidationSchema),UserControllers.createUser)
router.post("/login",UserControllers.loginUser)
router.post("/verify-user",auth(USER_ROLE.Admin,USER_ROLE.UnVerifiedUser,USER_ROLE.VerifiedUser),UserControllers.sendVerificationToken)
router.post("/verify-code",auth(USER_ROLE.Admin,USER_ROLE.VerifiedUser,USER_ROLE.UnVerifiedUser),validateRequest(UserValidation.verifyCodeValidationSchema),UserControllers.verifyCode)
router.post("/forget-password",UserControllers.sendForgetPasswordToken)
router.post("/reset-password",validateRequest(UserValidation.resetPasswordValidationSchema),UserControllers.resetPassword)
router.get("/get-me",auth(USER_ROLE.Admin,USER_ROLE.VerifiedUser,USER_ROLE.UnVerifiedUser),UserControllers.getMe)
router.get("/top-contributors",UserControllers.topContributors)

export const UserRoutes=router