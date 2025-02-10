import nodemailer from 'nodemailer'
import { NMConfigOptions } from './ConfigureNodeMailer'
import config from '../config'

export const sendEmail = async (subject: string, emailBody: string, userEmail: string) => {
    const transporter = nodemailer.createTransport(NMConfigOptions)
    const mailOptions = {
        from: config.emailAddress,
        to: userEmail,
        subject: subject,
        text: emailBody
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);  // Log for debugging
        return { success: true, message: 'Email sent successfully', response: info.response };
    } catch (error) {
        console.error("Error sending email: ", error);  // Log the error
        return { success: false, message: 'Failed to send email', error: error };
    }
}
