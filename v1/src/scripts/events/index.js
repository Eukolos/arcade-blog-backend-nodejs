const eventEmitter = require("./eventEmitter");
const nodemailer = require("nodemailer");

module.exports = () => {
    eventEmitter.on("send_email", (emailData) => {
        
        let transporter = nodemailer.createTransport({           
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
        });
        
        let msg = transporter.sendMail({
            from: process.env.EMAIL_FROM, // sender address
            ...emailData,     
        });  
    });
};

//! 02:07