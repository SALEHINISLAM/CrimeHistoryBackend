import mongoose from "mongoose"
import AppError from "../../errors/AppErrors"
import { TCrime } from "./crime.interface"
import { User } from "../User/user.model";
import httpStatus from "http-status"
import { v4 as uuidv4 } from 'uuid';
import { CrimeModel } from "./crime.model";
import { USER_ROLE } from "../User/user.constants";

const createCrimeReport = async (email: string, payload: TCrime) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    //console.log(email)
    try {
        const user = await User.findOne({ email: email }).session(session)
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "Please Login to post.")
        }
        if (user.role === USER_ROLE.UnVerifiedUser) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Please verify account to post.")
        }
        if (user.is_banned) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are banned!")
        }
        const { user_id } = user
        const crimePost = { ...payload }
        crimePost.user_id = user_id
        crimePost.verification_score = 0;
        crimePost.is_banned = false;
        crimePost.report_id = uuidv4()
        const result = await CrimeModel.create([{ ...crimePost }], { session })
        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(404, "Something went wrong")
    }
}

const updateCrimePost = async (email: string, payload: Partial<TCrime>, report_id: string) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { ...crimeData } = payload
        const user = await User.findOne({ email: email, is_banned: false })
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "UnAuthenticated")
        }
        const modifiedUpdatedData: Record<string, unknown> = { ...crimeData }
        const result = await CrimeModel.updateOne({ report_id: report_id, user_id: user.user_id,is_banned:false }, modifiedUpdatedData, { upsert: true })
        if (result.modifiedCount === 0) {
            throw new AppError(404, "Something went wrong")
        }
        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(404, "Something went wrong")
    }
}

export const CrimeServices = { createCrimeReport, updateCrimePost }