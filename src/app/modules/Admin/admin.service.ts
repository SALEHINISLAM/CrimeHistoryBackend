import AppError from "../../errors/AppErrors"
import { CrimeModel } from "../CrimeReport/crime.model"
import httpStatus from "http-status"

const bannedCrimeReport=async(report_id:string)=>{
    try {
        const result=await CrimeModel.updateOne({report_id:report_id},{is_banned:true})
        if (result.modifiedCount===0) {
            throw new AppError(httpStatus.NOT_FOUND,"Report not found")
        }
        return {message:"Post banned successfully."}
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,"Something went wrong")
    }
}

export const AdminsServices={bannedCrimeReport}