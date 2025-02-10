import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync=(fn:RequestHandler)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        console.log("🚀 Inside catchAsync - Request Received:", req.body);
        Promise.resolve(fn(req,res,next)).catch((err)=>next(err));
    }
}

export default catchAsync;