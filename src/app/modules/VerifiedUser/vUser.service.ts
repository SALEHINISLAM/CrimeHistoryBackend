import AppError from "../../errors/AppErrors";
import { User } from "../User/user.model";
import httpStatus from "http-status"

const editProfile = async (email: string, profilePic?: string, bio?: string) => {
    const user = await User.findOne({ email: email })
    if (user?.profile_pic) {
        if (profilePic && bio) {
            const result = await User.updateOne({ email: email }, { profile_pic: profilePic, bio: bio })
            if (result.modifiedCount > 0) {
                return result
            } else {
                throw new AppError(httpStatus.NOT_MODIFIED, "Failed to update profile")
            }
        }
        else if (profilePic) {
            const result = await User.updateOne({ email: email }, { profile_pic: profilePic })
            if (result.modifiedCount > 0) {
                return result
            } else {
                throw new AppError(httpStatus.NOT_MODIFIED, "Failed to update profile")
            }
        }
        else {
            const result = await User.updateOne({ email: email }, { bio: bio })
            if (result.modifiedCount > 0) {
                return result
            } else {
                throw new AppError(httpStatus.NOT_MODIFIED, "Failed to update profile")
            }
        }
    }
    else {
        if (profilePic && bio) {
            const result = await User.updateOne({ email: email }, { profile_pic: profilePic, bio: bio })
            if (result.modifiedCount > 0) {
                return result
            } else {
                throw new AppError(httpStatus.NOT_MODIFIED, "Failed to update profile")
            }
        }
        else if (profilePic) {
            const result = await User.updateOne({ email: email }, { profile_pic: profilePic })
            if (result.modifiedCount > 0) {
                return result
            } else {
                throw new AppError(httpStatus.NOT_MODIFIED, "Failed to update profile")
            }
        }
        else{
            throw new AppError(httpStatus.NOT_MODIFIED, "Please Upload Your Profile Picture First. It is required.")
        }
    }
}

export const VerifiedUserService = { editProfile }