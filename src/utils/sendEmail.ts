import nodemailer from "nodemailer";

const sendEmail = async (emailData : any) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "dh5bt2bwk2yudvaw@ethereal.email", // generated ethereal user. Uncomment lines 7-8 for new one
            pass: "nvcdRdFvZTn6Ay2AC9", // generated ethereal password Uncomment lines 7-8 for new one
        },
    });

    console.log(emailData);
    let info = await transporter.sendMail({
        from: emailData.sender, // sender address
        to: "robert.torres.lopez@gmail.com", //emailData.emailAddress, // list of receivers
        subject: emailData.subject, //"Change password", // Subject line
        html: emailData.text, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export = sendEmail;