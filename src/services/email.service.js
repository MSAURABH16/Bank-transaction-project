require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SwiftLedger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to SwiftLedger";

    const text = `Hello ${name},
Your SwiftLedger account has been created successfully.
Thank you for registering with us.

Regards,
SwiftLedger Team`;

    const html = `
<div style="font-family: Arial, sans-serif; background-color:#f4f7fb; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.08);">

        <div style="background:#2563eb; padding:20px; text-align:center;">
            <h1 style="color:white; margin:0;">SwiftLedger</h1>
        </div>

        <div style="padding:30px; color:#333;">
            <h2 style="margin-top:0;">Welcome, ${name}! 🎉</h2>

            <p>
                Your SwiftLedger account has been successfully created.
            </p>

            <div style="background:#f8fafc; border-left:4px solid #2563eb; padding:15px; margin:20px 0;">
                <strong>You can now:</strong>
                <ul style="padding-left:20px;">
                    <li>Manage bank accounts</li>
                    <li>Track transaction history</li>
                    <li>Transfer funds securely</li>
                    <li>Monitor account activity</li>
                </ul>
            </div>

            <p>
                We're excited to have you onboard and look forward to providing a secure banking experience.
            </p>

            <p>
                Regards,<br>
                <strong>SwiftLedger Team</strong>
            </p>
        </div>

        <div style="background:#f8fafc; text-align:center; padding:15px; font-size:12px; color:#666;">
            This is an automated email. Please do not reply.
        </div>

    </div>
</div>
`;
    await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    sendEmail,
    sendRegistrationEmail
};