import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { crimeValidations } from './crime.validations';
import { CrimeController } from './crime.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constants';
import { CrimeServices } from './crime.service';

const router=express.Router();

router.post("/create-crime-post",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.createCrimeValidationSchema),CrimeController.createCrimePost)
router.patch("/update-crime-post",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.updateCrimeValidationSchema),CrimeController.updateCrimePost)
router.post("/create-comment",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.createCommentValidationSchema),CrimeController.createComment)
router.patch("/update-comment",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.updateCommentValidationSchema),CrimeController.updateComment)
router.post("/vote-post",auth(USER_ROLE.VerifiedUser,USER_ROLE.Admin),validateRequest(crimeValidations.voteValidationSchema),CrimeController.votePost)
router.get("/get-post",CrimeController.getCrimePost)
router.get("/get-single-post",CrimeController.getCrimeReportById)

export const CrimeRoutes=router