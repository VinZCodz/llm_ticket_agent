import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST!,
    port: process.env.MAILTRAP_SMTP_PORT as any,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILTRAP_SMTP_USER!,
        pass: process.env.MAILTRAP_SMTP_PW!
    }
})

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const info = await transporter.sendMail({
            from: "Inngest TMS",
            to,
            subject,
            text,
        });
        console.log("Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Mail Error:", error);
        throw error;
    }
}