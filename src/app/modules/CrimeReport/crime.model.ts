import mongoose, { Schema, Document } from "mongoose";
import { TCrime } from "./crime.interface";
import { string } from "zod";

const commentSchema = new Schema(
    {
        comment_id: { type: String, required: true }, // Unique ID for each comment
        user_id: { type: String, required: true }, // ID of the user who commented
        comment: { type: String, required: true }, // The comment text
        proof_image_urls: { type: [String], default: [] }, 
        is_removed:{ type: Boolean, default: false }
    },
    {
        timestamps: true, // Enable automatic timestamps for comments
    }
);

// Mongoose Schema definition
const crimeSchema = new Schema<TCrime>({
    report_id: { type: String, required: true, unique: true },  
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    crime_time: { type: Number, required: true },
    image_urls: { type: [String] },
    video_url: { type: String },
    verification_score: { type: Number, default:0 },
    is_banned: { type: Boolean, default: false },
    comments:[commentSchema],
    upVotes: { type: [String], default:[] },
    downVotes: { type: [String], default:[] },
    is_verified:{ type: Boolean, default:false}
},
{
    timestamps:true
});

// Mongoose Model creation
export const CrimeModel = mongoose.model<TCrime>("Crime", crimeSchema);
