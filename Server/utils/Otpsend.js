import nodemailer from "nodemailer";
import config from "../config/congif.js";

export const sendVerificationEmail = async (email, otp) => {

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });


    let info = await transporter.sendMail({
        from: `"Fit Vision" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - Fit Vision",
        text: `Your verification OTP is: ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #f0f0f0; background-color: #f9f9f9;">
                <h2 style="text-align: center; color: #4a90e2;">Fit Vision</h2>
                <h3 style="color: #333;">Verify Your Email</h3>
                <p style="font-size: 16px;">Thank you for joining Fit Vision! To complete your registration, please verify your email using the OTP code below:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 10px 20px; font-size: 24px; color: #4a90e2; background-color: #e0f0ff; border-radius: 5px; font-weight: bold;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 14px; color: #666;">If you didn’t request this, please ignore this email.</p>
                <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />
                <div style="text-align: center; color: #888;">
                    <p>Stay connected and achieve your fitness goals with <strong>Fit Vision</strong>.</p>
                    <p style="font-size: 12px;">Fit Vision, Your Partner in Fitness. All rights reserved © 2024</p>
                </div>
            </div>
        `
    });

    console.log("Verification email sent: %s", info.messageId);
};
