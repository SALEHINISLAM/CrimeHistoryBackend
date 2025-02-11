import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import sendResponse from "../../utilis/sendResponse";
import { CrimeServices } from "./crime.service";
import httpStatus from "http-status"

const createCrimePost=catchAsync(async(req,res)=>{
    const crimePost=req.body;
    const user=req.user;
    console.log(user)
    const result = await CrimeServices.createCrimeReport(user?.email,crimePost);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post created successfully",
        data: result
    })
})
const updateCrimePost=catchAsync(async(req,res)=>{
    const crimePost=req.body;
    const user=req.user;
    const {report_id}=req.query;
    console.log(req.query)
    if (!report_id) {
        throw new AppError(httpStatus.NOT_FOUND,"Invalid report id provided")
    }
    const result = await CrimeServices.updateCrimePost(user?.email,crimePost,report_id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post updated successfully",
        data: result
    })
})

export const CrimeController={createCrimePost,updateCrimePost}