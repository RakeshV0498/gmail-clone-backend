import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rockr1204@gmail.com",
    pass: process.env.EMAIL_APP_KEY || "",
  },
});

export { transporter };
