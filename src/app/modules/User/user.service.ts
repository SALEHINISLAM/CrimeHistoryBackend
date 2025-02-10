import mongoose from "mongoose";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppErrors";
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE } from "./user.constants";
import sendResponse from "../../utilis/sendResponse";
import { sendEmail } from "../../NodeMailerSetup/SendEmail";

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
        const userInfo = { ...payload }
        userInfo.user_id = uuidv4()
        userInfo.role = USER_ROLE.UnVerifiedUser
        userInfo.verification_token = 0
        const result = await User.create([{ ...userInfo }], { session })
        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message)
    }
}

const sendVerificationToken = async (payload: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const email = payload;

    try {
        // Step 1: Generate the verification code
        const verificationCode = Math.floor(Math.random() * 9000) + 1000;
        console.log(`Generated verification code: ${verificationCode}`);

        // Step 2: Send the email
        const sendVerificationCode = await sendEmail("Verify Your Account", `Your verification code is ${verificationCode}`, email);
        console.log("Send Verification Code Result:", sendVerificationCode);
        
        // Ensure that email was sent
        if (!sendVerificationCode.success) {
            console.log("Email sending failed", sendVerificationCode.error);
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send verification email");
        }

        // Step 3: Fetch the user from the database
        const result = await User.findOne({ email: email }).session(session);
        if (!result) {
            console.log("User not found with email:", email);
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }

        const userInfo = result;
        console.log("User found:", userInfo);

        // Step 4: Update the user's verification token
        const updateResponse = await User.updateOne({ email: email }, { verification_token: verificationCode }).session(session);
        console.log("Update response:", updateResponse);

        if (updateResponse.modifiedCount === 0) {
            console.log("No documents were updated");
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update verification token");
        }

        // Step 5: Commit the session
        await session.commitTransaction();
        await session.endSession();
        console.log("Transaction committed successfully");

        return { success: true, message: "Verification token sent and saved successfully" };

    } catch (error:any) {
        console.error("Error occurred:", error);
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error: ${error?.message}`);
    }
};


export const userServices = { createUserIntoDB, sendVerificationToken }