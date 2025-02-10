import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import sendResponse from "../../utilis/sendResponse";
import { AuthServices } from "../Auth/auth.services";
import { userServices } from "./user.service";
import httpStatus from 'http-status';

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
    const result = await AuthServices.loginUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: result
    })
})

const sendVerificationToken = catchAsync(async (req, res) => {
    const user = req?.user;
    console.log(user)
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

export const UserControllers = { createUser, loginUser, sendVerificationToken }