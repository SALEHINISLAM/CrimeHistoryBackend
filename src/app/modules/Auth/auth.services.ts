import AppError from "../../errors/AppErrors";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../../config";

const loginUser=async (payload:TLoginUser)=>{
    const isUserExists= await User.findOne({email:payload.email}).select("+password")
    if (!isUserExists) {
        throw new AppError(401,"User not found")
    }
    else if (isUserExists.is_banned) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !')
    }
    const isPasswordMatched = await bcrypt.compare(payload?.password, isUserExists?.password)
    if (!isPasswordMatched) {
        throw new AppError(401, 'Invalid credentials')
    }
    const jwtPayload={
        email:isUserExists?.email,
        role: isUserExists?.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string , { expiresIn: '30d' })

    return {accessToken}
}

export const AuthServices = {
    loginUser
}