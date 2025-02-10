import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../../Types/Error";

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode = 400
    const errorSources: TErrorSources = [{
        path: err?.path,
        message: err?.message
    }]
    return { statusCode, message: "Invalid Credential", errorSources }
}

export default handleCastError