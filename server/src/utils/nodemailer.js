const nodemailer = require("nodemailer");
require("dotenv").config();

const EmailTransmitter = async(to, subject, html) => {
  return await  new Promise(async (res, rej) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      }, 
    }); 
    const mailOption = {
      from: `Sridhanvantariexports.com`,
      to: to,
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
        return rej({ msg: "Error" });
      } else {
        return res({ msg: "Email Send" });
      }
    });
  });
};
module.exports = { EmailTransmitter };