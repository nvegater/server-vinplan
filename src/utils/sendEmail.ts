import nodemailer from "nodemailer";

const sendEmail = async (emailData : any) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SEND_EMAIL_USER,
            pass: process.env.SEND_EMAIL_PASSWORD,
        },
    });
    await transporter.sendMail({
        from: emailData.sender, // sender address
        to: emailData.email, //emailData.emailAddress, // list of receivers
        subject: emailData.subject, //"Change password", // Subject line
        html: emailData.html, // html body
    });
};

export = sendEmail;