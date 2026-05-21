import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Ex: smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // Ex: 587 ou 465
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});