import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import httpStatus from "http-status"
import { AdminsServices } from "./admin.service";
import sendResponse from "../../utilis/sendResponse";

const bannedCrimeReport = catchAsync(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.")
    }
    const { report_id } = req.body
    if (!report_id) {
        throw new AppError(httpStatus.NOT_FOUND, "Report not found")
    }
    const result = await AdminsServices.bannedCrimeReport(report_id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post banned successfully",
        data: result
    })
})

const banUser = catchAsync(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    const result = await AdminsServices.banUser(email)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'The user is banned successfully',
        data: result,
    });
})

const getAllUser = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchQuery = req.query.search as string | undefined;
    const result = await AdminsServices.getAllUsers(page, limit, searchQuery)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users are retrived successfully',
        data: result,
    });
})

export const AdminController = { bannedCrimeReport, banUser, getAllUser }