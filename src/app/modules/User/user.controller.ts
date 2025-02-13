import config from "../../config";
import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import sendResponse from "../../utilis/sendResponse";
import { AuthServices } from "../Auth/auth.services";
import { userServices } from "./user.service";
import httpStatus from 'http-status';
import bcrypt from "bcrypt"

const createUser = catchAsync(async (req, res) => {
    const user = req.body;
    //console.log("from controller",req.body)
    const result = await userServices.createUserIntoDB(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User registered successfully",
        data: result
    })
})

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body,res)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: result
    })
})

const sendVerificationToken = catchAsync(async (req, res) => {
    const user = req?.user;
    if (user) {
        const result = await userServices.sendVerificationToken(user?.email)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Verification token sent . Please check your email and verify your account.",
            data: result
        })
    }
    else {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please Login to get verification token")
    }
})
const sendForgetPasswordToken = catchAsync(async (req, res) => {
    const user = req?.user;
    if (user) {
        const result = await userServices.sendForgetPasswordToken(user?.email)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Forget Password Token sent. Please check your email and verify it's you.",
            data: result
        })
    }
    else {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please Login to get verification token")
    }
})

const verifyCode=catchAsync(async(req,res)=>{
    const user=req.user
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please Login to get verification token") 
    }
    const result= await userServices.verifyCode(user.email,parseInt(req.body.code))
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "You have successfully verified your account!",
        data: result
    })
})

const resetPassword=catchAsync(async(req,res)=>{
    const user=req.user
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please Login to get verification token") 
    }
    const pass=await bcrypt.hash(req.body?.password,Number(config.bcrypt_salt_rounds))
    const result= await userServices.resetPassword(user.email,pass)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "You have successfully changed your password!",
        data: result
    })
})

const getMe=catchAsync(async(req,res)=>{
    const user=req.user
    console.log(user)
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please Login to get verification token") 
    }
    const result= await userServices.getMe(user.email)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrived successfully",
        data: result
    })
})

const topContributors = catchAsync(async (req, res) => {
    const contributors = await userServices.topContributors();

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "contributors fetched successfully",
        data: contributors,
    });
});

export const UserControllers = { createUser, loginUser, sendVerificationToken,verifyCode,sendForgetPasswordToken,resetPassword,getMe,topContributors }