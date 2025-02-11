import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join((process.cwd(),'.env'))})

export default {
    bcrypt_salt_rounds:process.env.Bcrypt_Salt_Rounds,
    port:process.env.PORT,
    db_url:process.env.DB_Url,
    mode:process.env.Node_Env,
    default_pass:process.env.Default_Pass,
    jwt_access_token: process.env.Jwt_Access_Token,
    jwt_refresh_token: process.env.Jwt_Refresh_Token,
    jwt_access_expires_in: process.env.Jwt_Access_Expires_In,
    jwt_refresh_expires_in: process.env.Jwt_Refresh_Expires_In,
    emailAddress: process.env.NMEmail,
    emailPassword:process.env.NMPass,
    emailHostName: process.env.NMServiceName,
}