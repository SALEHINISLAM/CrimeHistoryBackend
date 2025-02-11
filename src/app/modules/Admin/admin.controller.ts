import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import httpStatus from "http-status"
import { AdminsServices } from "./admin.service";
import sendResponse from "../../utilis/sendResponse";

const bannedCrimeReport=catchAsync(async(req,res)=>{
    const user=req.user
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized.")
    }
    const {report_id}=req.body
    if (!report_id) {
        throw new AppError(httpStatus.NOT_FOUND,"Report not found")
    }
    const result=await AdminsServices.bannedCrimeReport(report_id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post banned successfully",
        data: result
    })
})

export const AdminController ={bannedCrimeReport}