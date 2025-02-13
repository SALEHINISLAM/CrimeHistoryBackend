import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import httpStatus from "http-status"
import { USER_ROLE } from "../User/user.constants";
import { VerifiedUserService } from "./vUser.service";
import sendResponse from "../../utilis/sendResponse";

const editProfile =catchAsync(async(req,res)=>{
    const user=req.user;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND,"Please Login");
    }
    if (user.role == USER_ROLE.UnVerifiedUser) {
        throw new AppError(httpStatus.UNAUTHORIZED,"Please Verify Your Account"); 
    }
    const payload=req.body
    const profile_pic=payload?.profilePic
    const bio=payload?.bio
    const name=payload?.name
    console.log(payload)
    if (!profile_pic && !bio && !name) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE,"Please give some update information")
    }
    const result = await VerifiedUserService.editProfile(user.email, profile_pic, bio,name)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile is updated successfully!',
        data: result,
    });
})

export const VerifiedUserController={editProfile}