import AppError from "../../errors/AppErrors"
import { CrimeModel } from "../CrimeReport/crime.model"
import httpStatus from "http-status"
import { User } from "../User/user.model"
import { USER_ROLE } from "../User/user.constants"
import mongoose from "mongoose"

const bannedCrimeReport=async(report_id:string)=>{
    try {
        const result=await CrimeModel.updateOne({report_id:report_id},{is_banned:true})
        if (result.modifiedCount===0) {
            throw new AppError(httpStatus.NOT_FOUND,"Report not found")
        }
        return {message:"Post banned successfully."}
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,"Something went wrong")
    }
}

const banUser=async(email:string)=>{
    const user =await User.findOne({email:email});
    if (user?.role===USER_ROLE.Admin || user?.role===USER_ROLE.SuperAdmin) {
        throw new Error("The selected user is an admin")
    }
    const result = await User.updateOne({email:email},{role:USER_ROLE.UnVerifiedUser,is_banned:true},{upsert:false})
    if (result.modifiedCount===0) {
        throw new Error("Something went wrong")
    }
    return {message: "The user is banned"}
}

const getAllUsers = async (
    page: number = 1,
    limit: number = 10,
    searchQuery?: string
) => {
    try {
        const skip = (page - 1) * limit;

        // Define the base query
        let query: any = {};

        // If a search query is provided, add a regex filter for the name field
        if (searchQuery) {
            const regex = new RegExp(searchQuery, "i"); // Case-insensitive regex
            query.email = { $regex: regex }; 
            query.name = { $regex: regex }; 
        }

        // Fetch users with pagination and search filter
        const users = await User.find({...query,is_banned:false,role:{$ne:USER_ROLE.SuperAdmin}})
            .sort({ createdAt: -1 }) // Sort by latest first (optional)
            .skip(skip) // Skip documents for pagination
            .limit(limit) // Limit the number of documents returned
            .exec();

        // Get the total count of users (for frontend pagination UI)
        const totalUsers = await User.countDocuments({...query,is_banned:false,role:{$ne:USER_ROLE.SuperAdmin}});

        return {
            users,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
        };
    } catch (error: any) {
        console.error("Error fetching users:", error);

        // Handle errors
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessages = Object.values(error.errors).map((err) => err.message);
            throw new AppError(httpStatus.BAD_REQUEST, `Validation failed: ${errorMessages.join(", ")}`);
        }
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
};

export const AdminsServices={bannedCrimeReport,banUser,getAllUsers}