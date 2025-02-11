import httpStatus from 'http-status';
import catchAsync from '../../utilis/CatchAsync';
import { AuthServices } from './auth.services';
import sendResponse from '../../utilis/sendResponse';
import AppError from '../../errors/AppErrors';

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;
    console.log(passwordData)
    const result = await AuthServices.changePassword(req.user, passwordData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password is updated successfully!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);
    
    //console.log("auth controller",refreshToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: result,
    });
});

const createAdminFromVerifiedUser = catchAsync(async(req,res)=>{
    const {email}=req.body
    if (!email) {
        throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }
    const result= await AuthServices.createAdminFromVerifiedUser(email)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'The User role is updated',
        data: result,
    });
})

export const AuthController = { changePassword,refreshToken, createAdminFromVerifiedUser }