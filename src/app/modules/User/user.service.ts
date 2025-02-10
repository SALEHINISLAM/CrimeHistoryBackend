import mongoose from "mongoose";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppErrors";
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE } from "./user.constants";

const createUserIntoDB = async (payload: TUser) => {
    const session = await mongoose.startSession();
    console.log(payload)
    session.startTransaction();
    try {
        const isEmailExists = await User.findOne({ email: payload?.email }).session(session)
        if (isEmailExists) {
            throw new AppError(400, "The email already exists. Register with another email.")
        }
        const isPhoneExists = await User.findOne({ phone_number: payload?.phone_number }).session(session)
        if (isPhoneExists) {
            throw new AppError(400, "The phone number already exists. Register with another phone number.")
        }
        const userInfo={...payload}
        userInfo.user_id=uuidv4()
        userInfo.role=USER_ROLE.UnVerifiedUser
        const result = await User.create([{ ...userInfo }], { session })
        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error:any) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message)
    }
}

export const userServices={createUserIntoDB}