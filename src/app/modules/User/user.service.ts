import mongoose from "mongoose";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppErrors";
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid';
import { USER_ROLE } from "./user.constants";
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
        userInfo.contribution_score = 0
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

const sendForgetPasswordToken = async (payload: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const email = payload;

    try {
        // Step 1: Generate the verification code
        const verificationCode = Math.floor(Math.random() * 9000) + 1000;
        console.log(`Generated verification code: ${verificationCode}`);

        // Step 2: Send the email
        const sendVerificationCode = await sendEmail("Verify Your Code", `Your verification code is ${verificationCode}`, email);
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
        const updateResponse = await User.updateOne({ email: email }, { verification_token: verificationCode,needs_password_change:true }).session(session);
        console.log("Update response:", updateResponse);

        if (updateResponse.modifiedCount === 0) {
            console.log("No documents were updated");
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update verification token");
        }

        // Step 5: Commit the session
        await session.commitTransaction();
        await session.endSession();
        console.log("Transaction committed successfully");

        return { success: true, message: "Your requested code for forget password is sent." };

    } catch (error:any) {
        console.error("Error occurred:", error);
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error: ${error?.message}`);
    }
};

const verifyCode = async (email: string, code: number) => {
    const session = await mongoose.startSession();  // Start a new session
    session.startTransaction();  // Start the transaction
    try {        
        // Fetch the user with the verification code and session
        const checkCode = await User.findOne({ email: email, verification_token: code }).session(session);
        if (checkCode) {
            console.log("User found:", checkCode);
            
            // Check if the code was sent within the last 10 minutes
            const timeLimit = 10 * 60 * 1000;  // 10 minutes in milliseconds
            const currentTime = new Date().getTime();
            const codeTimestamp = new Date(checkCode.updatedAt).getTime();  // Get updatedAt timestamp
            
            console.log(`Current time: ${currentTime}, Code timestamp: ${codeTimestamp}`);
            
            // Check if the code is within the 10-minute limit
            if (currentTime - codeTimestamp > timeLimit) {
                console.log("Verification code has expired.");
                throw new AppError(httpStatus.REQUEST_TIMEOUT, "Verification code has expired.");
            }

            // Update the user's role and reset the verification code
            checkCode.role = USER_ROLE.VerifiedUser;
            checkCode.verification_token = 0;  // Reset the verification token

            // Perform the update operation with the session
            const result = await User.updateOne(
                { email: email },
                { role: USER_ROLE.VerifiedUser, verification_token: 0 }, // Only update necessary fields
                { upsert: false }
            ).session(session);

            console.log("Update response:", result);

            // If no document was modified, throw an error
            if (result.modifiedCount === 0) {
                console.log("No documents were updated.");
                throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error.");
            }

            // Commit the transaction
            await session.commitTransaction();
            await session.endSession();
            console.log("Transaction committed successfully");

            return result;

        } else {
            console.log("No user found with the given code.");
            throw new AppError(httpStatus.NOT_ACCEPTABLE, "Incorrect Code");
        }
    } catch (error:any) {
        console.error("Error occurred:", error);  // Log detailed error
        await session.abortTransaction();  // Abort transaction on error
        await session.endSession();  // End the session
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Something went wrong: ${error?.message}`);
    }
};

const resetPassword=async(email:string,password:string)=>{
    const result =await User.updateOne({email:email,needs_password_change:true,verification_token:0},{password:password,needs_password_change:false},{upsert:false}) 
    console.log(result)
    if (result.modifiedCount===0) {
        throw new AppError(httpStatus.UNAUTHORIZED,"Unauthorized")
    }
    return result
}

export const userServices = { createUserIntoDB, sendVerificationToken,verifyCode,sendForgetPasswordToken,resetPassword }