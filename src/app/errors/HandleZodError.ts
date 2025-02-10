import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../../Types/Error";
import httpStatus from "http-status";

const handleZodError=(err:ZodError):TGenericErrorResponse=>{
    const statusCode=httpStatus.NOT_ACCEPTABLE
    const errorSources:TErrorSources=err.issues.map((issue:ZodIssue)=>{
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message
        }
    })
    return { statusCode, message: "Validation Error", errorSources }
}

export default handleZodError;