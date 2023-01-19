import nodemailer from "nodemailer"

const email = process.env.gmail_username
export const transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: email, // generated ethereal user
      pass: process.env.gmail_password, // generated ethereal password
    },
  });
  
  export const mailOptions = {
    from:email,
    to:email
  }