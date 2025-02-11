import mongoose, { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import { number } from "zod";

const userSchema = new Schema<TUser, UserModel>(
    {
        user_id: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: 0
        },
        needs_password_change: {
            type: Boolean,
            default: false
        },
        verification_token:{
            type:Number
        },
        passwordChangedAt:{
            type: Date,
        },
        phone_number: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["SuperAdmin", "Admin", "VerifiedUser", "UnVerifiedUser"],
        },
        is_banned: {
            type: Boolean,
            default: false
        },
        profile_pic: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    const user = this;
    // hash password to save into database
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));

    next();
})

userSchema.post('save', function (doc, next) {
    doc.password = '';
    next()
})

userSchema.statics.isUserExistsByCustomId = async function (user_id: string) {
    return await User.findOne({ user_id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
) {
    const passwordChangedTime =
        new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);