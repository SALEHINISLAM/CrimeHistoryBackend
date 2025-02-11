import { UUIDTypes } from "uuid";

export interface TCrime{
    report_id:UUIDTypes,
    user_id:string,
    title:string,
    description:string,
    division:string,
    district:string,
    crime_time:Date,
    createdAt:Date,
    updatedAt:Date,
    image_urls:string[],
    video_url:string,
    verification_score:number,
    is_banned:boolean,
}