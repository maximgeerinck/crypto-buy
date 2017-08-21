import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo, Transporter } from "nodemailer";
import config from "../config";

const transporter: Transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: config.mail.port,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: "658e25f2c718aa07a61ac1d54d447546",
        pass: "634a8c4e35d11666334731a005796e8a"
    }
});

export const sendMail = (
    toEmails: string[],
    subject: string,
    html: string,
    fromEmail: string = config.mail.username,
    from: string = "Cryptotrackr"
): Promise<SentMessageInfo> => {
    const mailOptions: SendMailOptions = {
        from: '"Cryptotrackr" <hello@cryptotrackr.com>',
        to: toEmails.join(","),
        subject: "🎨 " + subject,
        html
    };

    return new Promise((resolve, reject) => {
        console.log(`${config.mail.username}`);
        transporter.sendMail(mailOptions).then((info) => resolve(info)).catch((error) => reject(error));
    });
};
