import { TErrorSources, TGenericErrorResponse } from "../../Types/Error";

const handleDuplicateError=(err:any):TGenericErrorResponse=>{
    const match= err.message.match(/"([^"]*)"/)
    const extractedMessage= match && match[1]
    const statusCode=400
    const errorSources:TErrorSources=[{
        path: '',
        message: `${extractedMessage} is already exists`
    }]
    return { statusCode, message: "Duplicate Entry", errorSources }
}

export default handleDuplicateError;