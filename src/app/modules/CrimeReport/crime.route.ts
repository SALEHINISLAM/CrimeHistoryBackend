import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { crimeValidations } from './crime.validations';
import { CrimeController } from './crime.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constants';

const router=express.Router();

router.post("/create-crime-post",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.createCrimeValidationSchema),CrimeController.createCrimePost)
router.patch("/update-crime-post",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.updateCrimeValidationSchema),CrimeController.updateCrimePost)

export const CrimeRoutes=router