const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const EmailTransmitter = async (to, subject, html, attachments = []) => {
  return await new Promise(async (res, rej) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const emailAttachments = attachments.map((attachment) => ({
      filename: path.basename(attachment.path),
      path: path.join(
        __dirname,
        "../../../client/src/assets",
        attachment.path
      ), 
      contentType: "application/pdf",
    }));

    const mailOption = {
      from: `Sridhanvantariexports.com`,
      to: to,
      subject: subject,
      html: html,
      attachments: emailAttachments,
    };

    await transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
        return rej({ msg: "Error" });
      } else {
        return res({ msg: "Email Sent" });
      }
    });
  });
};

module.exports = { EmailTransmitter };
