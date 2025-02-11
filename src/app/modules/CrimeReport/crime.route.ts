import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { crimeValidations } from './crime.validations';
import { CrimeController } from './crime.controller';

const router=express.Router();
router.post("/create-crime-post",validateRequest(crimeValidations.createCrimeValidationSchema),CrimeController.createCrimePost)

export const CrimeRoutes=router