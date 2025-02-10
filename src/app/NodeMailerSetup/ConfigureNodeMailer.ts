import config from "../config";

export const NMConfigOptions = {
    host: config.emailHostName,  // Hostinger SMTP host
    port: 465,  // Port for TLS (Use 465 for SSL)
    secure: true,  // Use TLS, set to true if using SSL with port 465
    auth: {
        user: config.emailAddress,  // Your Hostinger email address
        pass: config.emailPassword        // Your Hostinger email password
    },
    connectionTimeout: 10000,  // 10 seconds timeout for the connection
    socketTimeout: 10000 
}