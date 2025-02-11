import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidationSchema } from './auth.validation';
import { AuthController } from './auth.controller';

const router=express.Router();

router.post("/change-password",auth(USER_ROLE.Admin,USER_ROLE.UnVerifiedUser,USER_ROLE.VerifiedUser),validateRequest(AuthValidationSchema.changePasswordValidationSchema),AuthController.changePassword)

router.post("/refresh-token",validateRequest(AuthValidationSchema.refreshTokenValidationSchema),AuthController.refreshToken)

router.patch("/create-admin",auth(USER_ROLE.SuperAdmin),validateRequest(AuthValidationSchema.createAdminValidationSchema),AuthController.createAdminFromVerifiedUser)

router.patch("/remove-admin",auth(USER_ROLE.SuperAdmin),validateRequest(AuthValidationSchema.removeAdminValidationSchema),AuthController.removeAdminFromVerifiedUser)

router.patch("/ban-user",auth(USER_ROLE.SuperAdmin,USER_ROLE.Admin),validateRequest(AuthValidationSchema.banUserValidationSchema),AuthController.banUser)

export const AuthRoutes=router