import mongoose, { Schema, Document } from "mongoose";
import { TCrime } from "./crime.interface";

// Mongoose Schema definition
const crimeSchema = new Schema<TCrime>({
    report_id: { type: String, required: true, unique: true },  
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    crime_time: { type: Date, required: true },
    image_urls: { type: [String] },
    video_url: { type: String },
    verification_score: { type: Number, default:0 },
    is_banned: { type: Boolean, default: false },
},
{
    timestamps:true
});

// Mongoose Model creation
export const CrimeModel = mongoose.model<TCrime>("Crime", crimeSchema);
