import nodemailer from "nodemailer";

const sendEmail = async (emailData : any) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SEND_EMAIL_HOST || '',
        port: parseInt(process.env.SEND_EMAIL_PORT || ''),
        secure: false,
        auth: {
            user: process.env.SEND_EMAIL_USER,
            pass: process.env.SEND_EMAIL_PASSWORD,
        },
    });
    return await transporter.sendMail({
        from: process.env.SEND_EMAIL_USER, // sender address
        to: emailData.email, //emailData.emailAddress, // list of receivers
        subject: emailData.subject, //"Change password", // Subject line
        html: emailData.html, // html body
        attachments : emailData.attachments,
    });
};

export = sendEmail; 