import * as nodemailer from 'nodemailer';
import { SentMessageInfo, SendMailOptions, Transporter } from 'nodemailer';
import config from '../config';

const transporter: Transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: config.mail.username,
    pass: config.mail.password
  }
});

export const sendMail = (
  toEmails: Array<string>,
  subject: string,
  html: string,
  fromEmail: string = config.mail.username,
  from: string = 'Wallstilldawn'
): Promise<SentMessageInfo> => {
  const mailOptions: SendMailOptions = {
    from: '"Wallstilldawn" <hello@wallstilldawn.com>',
    to: toEmails.join(','),
    subject: '🎨 ' + subject,
    html: html
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions).then(info => resolve(info)).catch(error => reject(error));
  });
};
