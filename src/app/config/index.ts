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
    emailAddress: process.env.NMEmail,
    emailPassword:process.env.NMPass,
    emailHostName: process.env.NMServiceName
}