import catchAsync from "../../utilis/CatchAsync";
import sendResponse from "../../utilis/sendResponse";
import { CrimeServices } from "./crime.service";
import httpStatus from "http-status"

const createCrimePost=catchAsync(async(req,res)=>{
    const crimePost=req.body;
    const user=req.user;
    const result = await CrimeServices.createCrimeReport(user?.email,crimePost);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post created successfully",
        data: result
    })
})

export const CrimeController={createCrimePost}