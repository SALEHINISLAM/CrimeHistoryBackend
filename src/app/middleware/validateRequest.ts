import { AnyZodObject } from "zod";
import catchAsync from "../utilis/CatchAsync";
import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppErrors";

const validateRequest = (schema: AnyZodObject) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("from validator",req.body)
            await schema.parseAsync({
                body: req.body,
                cookies: req.cookies,
            });
            console.log("Validation Successful! Moving to next()...");
            next();
        } catch (error: any) {
            console.error("Validation Error:", error.errors);
            next(new AppError(400, "Validation Error", error.errors));
        }
    });
}

export default validateRequest;