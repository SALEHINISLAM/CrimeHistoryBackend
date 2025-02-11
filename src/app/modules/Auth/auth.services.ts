import AppError from "../../errors/AppErrors";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../../config";
import { createToken, verifyToken } from "./auth.utilis";
import { USER_ROLE } from "../User/user.constants";
import { Response } from "express";

const loginUser = async (payload: TLoginUser,res:Response) => {
    const isUserExists = await User.findOne({ email: payload.email }).select("+password")
    if (!isUserExists) {
        throw new AppError(401, "User not found")
    }
    else if (isUserExists.is_banned) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !')
    }
    const isPasswordMatched = await bcrypt.compare(payload?.password, isUserExists?.password)
    if (!isPasswordMatched) {
        throw new AppError(401, 'Invalid credentials')
    }
    const jwtPayload = {
        email: isUserExists?.email,
        role: isUserExists?.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, { expiresIn: '30m' })
    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_token as string, { expiresIn: '7d' });
    return { accessToken,refreshToken }
}

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
    // checking if the user is exist
    const user = await User.findOne({ email: userData.email }).select("+password");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    
    const isDeleted = user?.is_banned;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    
    const isPassMatch=await bcrypt.compare(payload.oldPassword,user.password)
    //console.log(isPassMatch)
    if (!isPassMatch)
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

    //hash new password
    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            email: userData.email
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;
};


const refreshToken = async (token: string) => {
    console.log("Token received for verification12:", token);
    const decoded = verifyToken(token, config.jwt_refresh_token as string);
    console.log("34  ",decoded)
    const { email, iat } = decoded;

    const user = await User.findOne({email: email});
    console.log(user)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    const isBanned = user?.is_banned;

    if (isBanned) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is banned !');
    }

    if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_token as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
}

const createAdminFromVerifiedUser=async (email:string)=>{
    const result = await User.updateOne({email:email,role:USER_ROLE.VerifiedUser},{role:USER_ROLE.Admin},{upsert:false})
    if (result.modifiedCount===0) {
        throw new AppError(httpStatus.NOT_MODIFIED,"Something went wrong")
    }
    return result
}

export const AuthServices = {
    loginUser,refreshToken,changePassword,createAdminFromVerifiedUser
}