import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';

const router=express.Router()

router.post('/register',validateRequest(UserValidation.createUserValidationSchema),UserControllers.createUser)
router.post("/login",UserControllers.loginUser)

export const UserRoutes=router