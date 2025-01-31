import { Resend } from 'resend';
import { ApiError } from './ApiError';
const resend = new Resend('re_FTxNXTd2_968c1Aeqyq6H6J4hJANMnT76');

type Email = {
    from: string;
    to: string[];
    subject: string;
    html: string;
}

export const sendmail = async function({from , to , subject , html}: Email) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html
    });

    console.log(data);
  } catch (error) {
    console.error(error);
   throw new ApiError(500, "Failed to send email");
  }
};

export const getPasswordResetTemplate = (otp: number) => ({
    subject: "Verify Your Email Address",
    text: `To reset your password, use the following OTP: ${otp}. It will expire in 10 minutes. If you did not request a password reset, please ignore this email.`,
    html: `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Password Reset OTP</title>
        <meta name="description" content="Password Reset OTP Email Template">
        <style type="text/css">
            a:hover { text-decoration: underline !important; }
        </style>
    </head>
    <body style="margin: 0; background-color: #f2f3f8; font-family: 'Open Sans', sans-serif;">
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8">
            <tr>
                <td>
                    <table style="background-color: #ffffff; max-width: 670px; margin: 50px auto; border-radius: 3px; text-align: center; box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 20px 35px;">
                                <h1 style="color: #333333; font-size: 24px; font-weight: 500;">Reset Your Password</h1>
                                <p style="font-size: 16px; line-height: 24px; color: #555555; margin: 15px 0;">Use the following OTP to reset your password. The OTP is valid for 10 minutes.</p>
                                <h2 style="color: #ff4c4c; font-size: 32px; margin: 20px 0;">${otp}</h2>
                                <p style="font-size: 14px; line-height: 18px; color: #888888;">If you did not request this, you can safely ignore this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`
  }
  );
  
  export const getVerifyEmailTemplate = (otp: number) => ({
    subject: "Your Login OTP",
    text: `Your OTP for login is: ${otp}. It will expire in 10 minutes. If you didn't request this, please ignore this email.`,
    html: `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Login OTP</title>
        <meta name="description" content="Login OTP Email Template">
        <style type="text/css">
            a:hover { text-decoration: underline !important; }
        </style>
    </head>
    <body style="margin: 0; background-color: #f2f3f8; font-family: 'Open Sans', sans-serif;">
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8">
            <tr>
                <td>
                    <table style="background-color: #ffffff; max-width: 670px; margin: 50px auto; border-radius: 3px; text-align: center; box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 20px 35px;">
                                <h1 style="color: #333333; font-size: 24px; font-weight: 500;">Your Login OTP</h1>
                                <p style="font-size: 16px; line-height: 24px; color: #555555; margin: 15px 0;">Use the following OTP to log in to your account. The OTP is valid for 10 minutes.</p>
                                <h2 style="color: #2f89ff; font-size: 32px; margin: 20px 0;">${otp}</h2>
                                <p style="font-size: 14px; line-height: 18px; color: #888888;">If you did not request this, you can safely ignore this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`
  }
  );