import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidationSchema } from './auth.validation';
import { AuthController } from './auth.controller';

const router=express.Router();

router.post("/change-password",auth(USER_ROLE.Admin,USER_ROLE.UnVerifiedUser,USER_ROLE.VerifiedUser),validateRequest(AuthValidationSchema.changePasswordValidationSchema),AuthController.changePassword)

router.post("/refresh-token",validateRequest(AuthValidationSchema.refreshTokenValidationSchema),AuthController.refreshToken)

export const AuthRoutes=router