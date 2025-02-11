import { Model } from "mongoose";
import { USER_ROLE } from "./user.constants";

export interface TUser {
    user_id: string;
    email: string;
    role: "SuperAdmin" | "Admin" | "VerifiedUser" | "UnVerifiedUser";
    password: string;
    needs_password_change:boolean;
    verification_token:number;
    passwordChangedAt?: Date;
    phone_number: string;
    is_banned: boolean;
    profile_pic: string;
    bio: string;
    updatedAt:Date;
    createdAt: Date;
}

export interface UserModel extends Model<TUser> {
    //instance methods for checking if the user is exists
    isUserExistsByCustomId(user_id: string): Promise<TUser>
    //instance methods for checking if the password is matched
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number,
    ): boolean;
}

export type TUserRole= keyof typeof USER_ROLE