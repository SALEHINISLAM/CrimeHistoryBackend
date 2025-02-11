import { UUIDTypes } from "uuid";

export interface TCrime{
    report_id:UUIDTypes,
    user_id:string,
    title:string,
    description:string,
    division:string,
    district:string,
    crime_time:number,// save as milisecond
    createdAt:Date,
    updatedAt:Date,
    image_urls:string[],
    video_url:string,
    verification_score:number,
    is_banned:boolean,
    comments: {
        comment_id: UUIDTypes; // Unique ID for each comment
        user_id: string; // ID of the user who commented
        comment: string; // The comment text
        proof_image_urls:string[],
        createdAt: Date; // Timestamp of the comment
        updatedAt: Date; // Timestamp of the last update
        is_removed:boolean
    }[],
    upVotes:string[],
    downVotes:string[]
}