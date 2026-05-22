import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or use host/port
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

// Optional: verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Mailer Error:", error);
  } else {
    console.log("Mailer is ready");
  }
});

export default transporter;