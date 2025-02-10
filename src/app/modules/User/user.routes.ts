import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';

const router=express.Router()

router.post('/register',validateRequest(UserValidation.createUserValidationSchema),UserControllers.createUser)
router.post("/login",UserControllers.loginUser)
router.post("/verify-user",auth(USER_ROLE.Admin,USER_ROLE.UnVerifiedUser,USER_ROLE.VerifiedUser),UserControllers.sendVerificationToken)

export const UserRoutes=router