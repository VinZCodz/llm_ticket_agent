const nodemailer form "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST!,
    port: process.env.MAILTRAP_SMTP_PORT!,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILTRAP_SMTP_USER!,
        pass: process.env.MAILTRAP_SMTP_PW!,
    },
});

export default const sendMail = async (to: string, from: string, subject: string, text: string) => {
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
        console.error("Mail Error:", error.message);
        throw error;
    }
}