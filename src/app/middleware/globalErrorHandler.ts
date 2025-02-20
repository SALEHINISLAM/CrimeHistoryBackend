import { ErrorRequestHandler } from "express";
import {  TErrorSources } from "../../Types/Error";
import { ZodError } from "zod";
import handleZodError from "../errors/HandleZodError";
import handleValidationError from "../errors/HandleValidationErros";
import handleCastError from "../errors/HandleCastError";
import handleDuplicateError from "../errors/HandleDuplicateError";
import AppError from "../errors/AppErrors";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next)=> {
    console.log(err?.statusCode);
    let statusCode = 500;
    let message = "Something went wrong!"
    let errorSources: TErrorSources = [{
        path: '',
        message: "Something went wrong!",
    }]

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources
    }
    else if (err?.name === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources
    }
    else if (err?.name === 'CastError') {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }
    else if (err?.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }
    else if (err instanceof AppError) {
        statusCode = err?.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    }
    //ultimate return
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: config.mode === 'Development' ? err?.stack : null,
    });
}

export default globalErrorHandler;

// error pattern
/*
success
message
errorSources:[
  path:'',
  message:''
]
err
stack
*/
