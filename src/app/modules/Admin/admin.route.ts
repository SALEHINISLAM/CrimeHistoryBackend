import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from './admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constants';

const router=express.Router();

router.patch('/ban_report',auth(USER_ROLE.Admin,USER_ROLE.SuperAdmin),validateRequest(AdminValidations.bannedCrimeValidationSchema),AdminController.bannedCrimeReport)
router.patch("/ban-user",auth(USER_ROLE.SuperAdmin,USER_ROLE.Admin),validateRequest(AdminValidations.banUserValidationSchema),AdminController.banUser)
router.get('/get-all-user',auth(USER_ROLE.SuperAdmin,USER_ROLE.Admin),AdminController.getAllUser)

export const AdminRoutes=router