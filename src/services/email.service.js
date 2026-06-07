
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
        console.log('SwiftLedger email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    console.log("sendEmail called");
    try {
        console.log("Sending mail to:", to);
        const info = await transporter.sendMail({
            from: `"SwiftLedger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(userEmail, name) {
    console.log("sendRegistrationEmail called");
    const subject = 'Welcome to SwiftLedger!';

    const text = `Hello ${name},

Thank you for registering with SwiftLedger.
Your account has been successfully created and is ready to use.

Best regards,
SwiftLedger Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:40px 20px;">
                    <table width="600" cellpadding="0" cellspacing="0"
                        style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

                        <tr>
                            <td style="background:#2563eb;padding:24px;text-align:center;">
                                <h1 style="color:white;margin:0;">SwiftLedger</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:32px;">
                                <h2 style="color:#111827;margin-top:0;">
                                    Welcome, ${name}! 🎉
                                </h2>

                                <p style="color:#4b5563;line-height:1.6;">
                                    Thank you for registering with SwiftLedger.
                                    Your account has been successfully created and is ready to use.
                                </p>

                                <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px;margin:24px 0;">
                                    <strong>Account Status:</strong> Active
                                </div>

                                <p style="color:#4b5563;line-height:1.6;">
                                    We're excited to have you onboard.
                                </p>

                                <p style="margin-top:32px;">
                                    Best regards,<br>
                                    <strong>SwiftLedger Team</strong>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
                                © 2026 SwiftLedger. All rights reserved.
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';

    const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} was successful.

Best regards,
SwiftLedger Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:40px 20px;">
                    <table width="600" style="background:white;border-radius:12px;padding:32px;">
                        <tr>
                            <td>
                                <h2 style="color:#16a34a;">
                                    Transaction Successful ✅
                                </h2>

                                <p>Hello ${name},</p>

                                <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
                                    <p><strong>Amount:</strong> $${amount}</p>
                                    <p><strong>Recipient Account:</strong> ${toAccount}</p>
                                    <p><strong>Status:</strong> Successful</p>
                                </div>

                                <p>
                                    Thank you for using SwiftLedger.
                                </p>

                                <p>
                                    Best regards,<br>
                                    <strong>SwiftLedger Team</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';

    const text = `Hello ${name},

We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed.

Please try again later.

Best regards,
SwiftLedger Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:40px 20px;">
                    <table width="600" style="background:white;border-radius:12px;padding:32px;">
                        <tr>
                            <td>
                                <h2 style="color:#dc2626;">
                                    Transaction Failed ❌
                                </h2>

                                <p>Hello ${name},</p>

                                <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;">
                                    <p><strong>Amount:</strong> $${amount}</p>
                                    <p><strong>Recipient Account:</strong> ${toAccount}</p>
                                    <p><strong>Status:</strong> Failed</p>
                                </div>

                                <p>
                                    Please verify your account details and try again later.
                                </p>

                                <p>
                                    Best regards,<br>
                                    <strong>SwiftLedger Team</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};

