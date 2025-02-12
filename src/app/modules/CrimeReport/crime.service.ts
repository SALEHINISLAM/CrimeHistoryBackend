import mongoose from "mongoose"
import AppError from "../../errors/AppErrors"
import { TCrime } from "./crime.interface"
import { User } from "../User/user.model";
import httpStatus from "http-status"
import { v4 as uuidv4 } from 'uuid';
import { CrimeModel } from "./crime.model";
import { USER_ROLE } from "../User/user.constants";

const createCrimeReport = async (email: string, payload: Partial<TCrime>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the user
        const user = await User.findOne({ email: email }).session(session);
        console.log("User:", user);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "Please login to post.");
        }
        if (user.role === USER_ROLE.UnVerifiedUser) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Please verify your account to post.");
        }
        if (user.is_banned) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are banned!");
        }

        // Prepare the crime post
        const { user_id } = user;
        const crimePost = {
            ...payload,
            user_id,
            verification_score: 0,
            is_banned: false,
            report_id: uuidv4(),
            comments: [],
            upVotes: [],
            downVotes: [],
        };

        console.log("Crime Post Data:", crimePost);

        // Create the crime post
        const result = await CrimeModel.create([crimePost], { session });
        console.log("Crime Post Created:", result);
        const updateContribution=await User.updateOne({user_id:user_id},{contribution_score:user.contribution_score+5})
        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();

        // Log the error for debugging
        console.error("Error creating crime report:", error);

        // Handle Mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            // Extract validation error messages
            const errorMessages = Object.values(error.errors).map((err) => err.message);
            throw new AppError(httpStatus.BAD_REQUEST, `Validation failed: ${errorMessages.join(", ")}`);
        }
        if (error?.code === 11000) {
            throw new AppError(httpStatus.BAD_REQUEST, "Duplicate key error. Please check your data.");
        }
        // Handle other errors
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
};

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
        const result = await CrimeModel.updateOne({ report_id: report_id, user_id: user.user_id, is_banned: false }, modifiedUpdatedData, { upsert: true })
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

const createComment = async (email: string, report_id: string, commentData: { comment: string; proof_image_urls?: string[] }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if the user exists and is authorized
        const user = await User.findOne({ email: email }).session(session);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "Please login to comment.");
        }
        if (user.role === USER_ROLE.UnVerifiedUser) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Please verify your account to comment.");
        }
        if (user.is_banned) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are banned and cannot comment.");
        }

        // Check if the crime report exists
        const crimeReport = await CrimeModel.findOne({ report_id: report_id, is_banned: false }).session(session);
        if (!crimeReport) {
            throw new AppError(httpStatus.NOT_FOUND, "Crime report not found or is banned.");
        }
        const postScore = crimeReport.verification_score
        crimeReport.verification_score = postScore + 2
        // Create the comment object
        const newComment = {
            comment_id: uuidv4(), // Generate a unique ID for the comment
            user_id: user.user_id, // Attach the user ID
            comment: commentData.comment, // Comment text
            proof_image_urls: commentData.proof_image_urls,
        };
        const updateUser=await User.updateOne({user_id:user.user_id},{contribution_score:user.contribution_score+2});
        // Add the comment to the crime report
        crimeReport.comments.push(newComment as any);
        await crimeReport.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return { newComment, message: "Your comment posted." };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create comment.");
    }
};

/**
 * Update an existing comment on a crime report
 */
const updateComment = async (email: string, report_id: string, comment_id: string, updateData: { comment?: string; proof_image_urls?: string[] }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("update ", email)
    try {
        const user = await User.findOne({ email: email }).session(session);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "Please login to update the comment.");
        }
        if (user.is_banned) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are banned and cannot update comments.");
        }

        const crimeReport = await CrimeModel.findOne({ report_id: report_id, is_banned: false }).session(session);
        if (!crimeReport) {
            throw new AppError(httpStatus.NOT_FOUND, "Crime report not found or is banned.");
        }

        // Find the comment to update
        const commentIndex = crimeReport.comments.findIndex(
            (comment) => comment.comment_id === comment_id && comment.user_id === user.user_id && comment.is_removed != true
        );
        if (commentIndex === -1) {
            throw new AppError(httpStatus.NOT_FOUND, "Comment not found or you are not authorized to update it.");
        }

        // Update the comment fields if they are provided
        if (updateData.comment !== undefined) {
            crimeReport.comments[commentIndex].comment = updateData.comment;
        }
        if (updateData.proof_image_urls !== undefined) {
            crimeReport.comments[commentIndex].proof_image_urls = updateData.proof_image_urls;
        }

        // Mark the comments array as modified
        crimeReport.markModified('comments');

        // Save the updated crime report
        await crimeReport.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return crimeReport.comments[commentIndex]; // Return the updated comment
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        // Log the error for debugging
        console.error("Error updating comment:", error);

        // Handle Mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            throw new AppError(httpStatus.BAD_REQUEST, error.message);
        }

        // Handle other errors
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update comment.");
    }
};

const votePost = async (report_id: string, email: string, vote_type: "upVote" | "downVote" | "noVote") => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user=await User.findOne({email:email,is_banned:false})
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND,"User not found")
        }
        const {user_id}=user
        // Find the crime report
        const crimeReport = await CrimeModel.findOne({ report_id: report_id, is_banned: false }).session(session);
        if (!crimeReport) {
            throw new AppError(httpStatus.NOT_FOUND, "Crime report not found or is banned.");
        }

        // Check if the user has already upvoted or downvoted
        const hasUpVoted = crimeReport.upVotes.includes(user_id);
        const hasDownVoted = crimeReport.downVotes.includes(user_id);

        // Handle the vote type
        switch (vote_type) {
            case "upVote":
                if (hasUpVoted) {
                    throw new AppError(httpStatus.BAD_REQUEST, "You have already upVoted this post.");
                }

                // If the user previously downvoted, remove their downvote
                if (hasDownVoted) {
                    crimeReport.downVotes = crimeReport.downVotes.filter((id) => id !== user_id);
                    crimeReport.verification_score += 1; 
                }

                // Add the user's ID to the upvotes array
                crimeReport.upVotes.push(user_id);

                // Increase the verification score by 1
                crimeReport.verification_score += 1;
                break;

            case "downVote":
                if (hasDownVoted) {
                    throw new AppError(httpStatus.BAD_REQUEST, "You have already downVoted this post.");
                }

                // If the user previously upvoted, remove their upvote
                if (hasUpVoted) {
                    crimeReport.upVotes = crimeReport.upVotes.filter((id) => id !== user_id);
                    crimeReport.verification_score -= 1; // Reverse the upvote effect
                }

                // Add the user's ID to the downvotes array
                crimeReport.downVotes.push(user_id);

                // Decrease the verification score by 1
                crimeReport.verification_score -= 1;
                break;

            case "noVote":
                // If the user previously upvoted, remove their upvote
                if (hasUpVoted) {
                    crimeReport.upVotes = crimeReport.upVotes.filter((id) => id !== user_id);
                    crimeReport.verification_score -= 1; // Reverse the upvote effect
                }

                // If the user previously downvoted, remove their downvote
                if (hasDownVoted) {
                    crimeReport.downVotes = crimeReport.downVotes.filter((id) => id !== user_id);
                    crimeReport.verification_score += 1; // Reverse the downvote effect
                }
                break;

            default:
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid vote type.");
        }

        if (crimeReport.verification_score > 10) {
            crimeReport.is_verified = true;
        } else {
            crimeReport.is_verified = false;
        }

        // Save the updated crime report
        await crimeReport.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return { message: `${vote_type} successful.` };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        console.error("Error voting:", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to process vote.");
    }
};

const getCrimeReportById = async (report_id: string) => {
    try {
        // Find the crime report by ID
        const crimeReport = await CrimeModel.findOne({ report_id: report_id, is_banned: false }).exec();
        console.log("first")
        // If no crime report is found, throw an error
        if (!crimeReport) {
            throw new AppError(httpStatus.NOT_FOUND, "Crime report not found");
        }

        return crimeReport;
    } catch (error: any) {
        console.error("Error fetching crime report by ID:", error);

        // Handle errors
        if (error instanceof mongoose.Error.CastError) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid crime report ID");
        }
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
};

const getCrimeReports = async (page: number = 1, limit: number = 10, searchQuery?: string, district?: string, division?: string) => {
    try {
        const skip = (page - 1) * limit;

        // Define the base query
        let query:any = {};

        // If a search query is provided, add a regex filter for title and description
        if (searchQuery) {
            const regex = new RegExp(searchQuery, "i");
            query = {
                $or: [
                    { title: { $regex: regex } }, 
                    { description: { $regex: regex } }, 
                ],
            };
        }

        if (district) {
            query.district = district; 
        }
        if (division) {
            query.division = division; // Exact match for division
        }

        // Fetch crime reports with pagination and search filter
        const crimeReports = await CrimeModel.find({...query,is_banned:false})
            .sort({ createdAt: -1 }) // Sort by latest first (optional)
            .skip(skip) // Skip documents for pagination
            .limit(limit) // Limit the number of documents returned
            .exec();

        // Get the total count of crime reports (for frontend pagination UI)
        const totalReports = await CrimeModel.countDocuments({...query,is_banned:false});

        return {
            crimeReports,
            totalReports,
            currentPage: page,
            totalPages: Math.ceil(totalReports / limit),
        };
    } catch (error: any) {
        console.error("Error fetching crime reports:", error);

        // Handle errors
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessages = Object.values(error.errors).map((err) => err.message);
            throw new AppError(httpStatus.BAD_REQUEST, `Validation failed: ${errorMessages.join(", ")}`);
        }
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
};

export const CrimeServices = { createCrimeReport, updateCrimePost, createComment, updateComment, votePost, getCrimeReports, getCrimeReportById }