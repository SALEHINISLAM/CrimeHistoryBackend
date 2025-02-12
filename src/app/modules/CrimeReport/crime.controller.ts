import AppError from "../../errors/AppErrors";
import catchAsync from "../../utilis/CatchAsync";
import sendResponse from "../../utilis/sendResponse";
import { CrimeServices } from "./crime.service";
import httpStatus from "http-status"

const createCrimePost=catchAsync(async(req,res)=>{
    const crimePost=req.body;
    const user=req.user;
    console.log(user)
    const result = await CrimeServices.createCrimeReport(user?.email,crimePost);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post created successfully",
        data: result
    })
})
const updateCrimePost=catchAsync(async(req,res)=>{
    const crimePost=req.body;
    const user=req.user;
    const {report_id}=req.query;
    console.log(req.query)
    if (!report_id) {
        throw new AppError(httpStatus.NOT_FOUND,"Invalid report id provided")
    }
    const result = await CrimeServices.updateCrimePost(user?.email,crimePost,report_id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime Post updated successfully",
        data: result
    })
})

const createComment = catchAsync(async (req, res) => {
    const { report_id } = req.query; // Get report_id from URL params
    const { comment, proof_image_urls } = req.body; // Get comment data from request body
    const user = req.user; // Get authenticated user from request

    if (!report_id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Report ID is required.");
    }

    // Call the service function to create the comment
    const result = await CrimeServices.createComment(user?.email, report_id as string, {
        comment,
        proof_image_urls,
    });

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment created successfully",
        data: result,
    });
});

const updateComment = catchAsync(async (req, res) => {
    const { report_id, comment_id } = req.query; // Get report_id and comment_id from URL params
    const { comment, proof_image_urls } = req.body; // Get updated comment data from request body
    const user = req.user; // Get authenticated user from request

    if (!report_id || !comment_id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Report ID and Comment ID are required.");
    }
    console.log('first')
    // Call the service function to update the comment
    const result = await CrimeServices.updateComment(user?.email, report_id as string, comment_id as string, {
        comment,
        proof_image_urls,
    });

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment updated successfully",
        data: result,
    });
});

const votePost = catchAsync(async (req, res) => {
    const { report_id } = req.query; // Get report_id from URL params
    const { vote_type } = req.body; // Get vote_type from request body
    const user = req.user; // Get authenticated user from request

    if (!report_id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Report ID is required.");
    }
    if (!vote_type) {
        throw new AppError(httpStatus.BAD_REQUEST, "Vote type is required.");
    }

    // Call the service function to process the vote
    const result = await CrimeServices.votePost(report_id as string, user?.user_id, vote_type);

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});

const getCrimePost = catchAsync(async (req, res) => {
    // Extract pagination parameters from query (default: page=1, limit=10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Fetch crime posts with pagination
    const result = await CrimeServices.getCrimeReports(page, limit);

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Crime posts fetched successfully",
        data: result,
    });
});

export const CrimeController={createCrimePost,updateCrimePost,createComment,updateComment,votePost,getCrimePost}