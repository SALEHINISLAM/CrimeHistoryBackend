import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../modules/User/user.interface";
import catchAsync from "../utilis/CatchAsync";
import AppError from "../errors/AppErrors";
import httpStatus from "http-status"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config";
import { User } from "../modules/User/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        //console.log(token)
        //check if token is missing
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        }
        let decoded;
        try {
            //checking if the token is valid
            decoded = jwt.verify(
                token,
                config.jwt_access_token as string,
            ) as JwtPayload;
        } catch (error) {
            throw new AppError(httpStatus.UNAUTHORIZED, "UnAuthorizedError")
        }
        const { role, email, iat } = decoded;
        //console.log(decoded)
        //checking if the user is exists
        const user = await User.findOne({email:email})
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "This user does not exist")
        }
        //checking if the user already banned
        const isBanned = user.is_banned
        if (isBanned) {
            throw new AppError(httpStatus.FORBIDDEN, "This user is banned by our admin")
        }
        
        //check if the user has required roles
        if (
            user.passwordChangedAt &&
            User.isJWTIssuedBeforePasswordChanged(
                user.passwordChangedAt,
                iat as number,
            )
        ) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }
        req.user = decoded as JwtPayload & { role: string };
        next();
    })
}

export default auth;