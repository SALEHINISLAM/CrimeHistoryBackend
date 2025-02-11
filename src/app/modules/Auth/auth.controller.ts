import httpStatus from 'http-status';
import catchAsync from '../../utilis/CatchAsync';
import { AuthServices } from './auth.services';
import sendResponse from '../../utilis/sendResponse';

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
    
    console.log("auth controller",refreshToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: result,
    });
});

export const AuthController = { changePassword,refreshToken }