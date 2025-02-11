import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status'

export const createToken=(
    jwtPayload:{email:string, role:string},
    secret:string,
    expiresIn:string ,
)=>{
    console.log("from create token", jwtPayload);
    return jwt.sign(jwtPayload, secret, {expiresIn});
}

export const verifyToken=(token:string,secret:string):JwtPayload=>{
    try {
        console.log("From verify token func", token);
        
        // Attempt to verify the token
        const decoded = jwt.verify(token, secret);
        
        // If successful, log the decoded token
        console.log("from decoded line ", decoded);
        return decoded as JwtPayload;
    } catch (error) {
        // Catch any errors and log them for debugging
        console.error("Error verifying token:", error);
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
}
