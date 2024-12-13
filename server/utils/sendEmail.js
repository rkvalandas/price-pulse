const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail service
    host: 'smtp.gmail.com', // SMTP server for Gmail
    port: 587, // Typically, Gmail uses port 587 for TLS
    secure: false, // Set to false to use TLS instead of SSL
    tls: {
        ciphers: 'SSLv3', // Force SSLv3 for backward compatibility (optional, may not be needed)
    },
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from environment variables
        pass: process.env.EMAIL_PASS, // App password or your Gmail password (consider using an app password)
    }
});

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.MAIL_SENDER, // Sender address
        to, // Recipient address
        subject, // Subject line
        html, // HTML body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
