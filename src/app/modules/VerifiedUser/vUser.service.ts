import AppError from "../../errors/AppErrors";
import { User } from "../User/user.model";
import httpStatus from "http-status"

const editProfile = async (email: string, profile_pic?: string, bio?: string, name?: string) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }

        // Check if name is required (i.e., user has never set a name before)
        const requiresName = !user.name;

        if (requiresName && !name) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please provide a name before updating your profile");
        }

        // Prepare the update fields dynamically
        const updateFields: Record<string, any> = {};

        if (profile_pic) updateFields.profile_pic = profile_pic; // Use profile_pic consistently
        if (bio) updateFields.bio = bio;
        if (name) updateFields.name = name;

        if (Object.keys(updateFields).length === 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "No changes provided for update");
        }

        console.log("Update Fields:", updateFields);

        // Update user data
        const result = await User.updateOne(
            { email: email }, // Filter by email
            { $set: updateFields } // Use $set to update the fields
        );

        console.log("Update Result:", result);

        if (result.modifiedCount > 0) {
            return {
                success: true,
                message: "Profile updated successfully",
                statusCode: httpStatus.OK,
            };
        } else {
            throw new AppError(httpStatus.NOT_MODIFIED, "Failed to update profile");
        }
    } catch (error: any) {
        console.error("Error updating profile:", error);
        throw new AppError(
            error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
            error?.message || "Something went wrong while updating the profile"
        );
    }
};

export const VerifiedUserService = { editProfile }