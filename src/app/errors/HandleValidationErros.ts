import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../../Types/Error";
import httpStatus from "http-status";

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const statusCode = httpStatus.NOT_ACCEPTABLE
    const errorSources: TErrorSources = Object.values(err.errors).map((val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
            path: val?.path,
            message: val?.message
        }
    })

    return { statusCode, message: "Validation Error", errorSources }
}

export default handleValidationError;