import { z } from 'zod';
import bcrypt from 'bcrypt';
import UserModel from '../Models/user.model.js';
import config from '../config/congif.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


//============================Signup============================


const signupSchema = z.object({
    username: z.string()
        .min(3, "Username should be at least 3 characters long")
        .max(30, "Username should not be more than 30 characters long")
    ,

    firstname: z.string()
        .min(2, "First name should be at least 2 characters long")
        .max(50, "First name should not be more than 50 characters long")
        .regex(/^[^\d].*$/, "First name should not start with a number")
        .regex(/^[a-zA-Z]+$/, "First name should not contain any numbers"),

    lastname: z.string()
        .min(2, "Last name should be at least 2 characters long")
        .max(50, "Last name should not be more than 50 characters long")
        .regex(/^[^\d].*$/, "Last name should not start with a number")
        .regex(/^[a-zA-Z]+$/, "Last name should not contain any numbers"),

    email: z.string()
        .email("Invalid email address"),

    password: z.string()
        .min(6, "Password should be at least 6 characters long")
        .max(100, "Password should not be more than 100 characters long"),

    photoURL: z.string().optional()
});


export const signup = async (req, res) => {
    try {

        const validatedData = signupSchema.parse(req.body);

        const existingUser = await UserModel.findOne({
            $or: [{ email: validatedData.email }, { username: validatedData.username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }
        const hashedPassword = await bcrypt.hash(validatedData.password, config.bcrypt.saltRounds);
        const newUser = new UserModel({
            ...validatedData,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email

            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            console.log(JSON.stringify(errorMessages, null, 2));
            return res.status(400).json({
                message: errorMessages[0].message,
                errors: errorMessages
            });
        }
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//============================Login============================

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validUser = await UserModel.findOne({ email });
        if (!validUser) {
            return res.status(403).json({ message: "Invalid email" });
        }
        const validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(403).json({ message: "Invalid password" });
        }
        const token = jwt.sign({
            id: validUser._id,
            username: validUser.username,
            email: validUser.email,
            name: `${validUser.firstname} ${validUser.lastname}`
        }, config.jwt.secret, { expiresIn: '1h' });

        res.status(200)
            .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
            .json({
                message: "Login successful",
                token,
                user: {
                    id: validUser._id,
                    username: validUser.username,
                    email: validUser.email,
                    name: `${validUser.firstname} ${validUser.lastname}`,
                    PhotoURL: validUser.photoURL,
                    isPro: validUser.isPro,
                },
                validUser
            });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



//============================Google OAuth============================
const googleSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    photoURL: z.string()
});

export const google = async (req, res) => {
    try {
        const { name, email, photoURL } = googleSchema.parse(req.body);
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            const token = jwt.sign({
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                name: `${existingUser.firstname} ${existingUser.lastname}`
            }, config.jwt.secret, { expiresIn: '1h' });

            return res.status(200)
                .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
                .json({
                    message: "Login successful",
                    token,
                    user: {
                        id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email,
                        name: `${existingUser.firstname} ${existingUser.lastname}`
                    }
                });
        }
        else {
            // const genratedPassword = Math.random().toString(36).slice(-8);
            const newUser = new UserModel({
                username: email.split('@')[0],
                firstname: name.split(' ')[0],
                lastname: name.split(' ')[1] || '',
                email,
                photoURL,
                password: await bcrypt.hash(email, 10)
            });
            await newUser.save();
            const token = jwt.sign({
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                name: `${newUser.firstname} ${newUser.lastname}`
            }, config.jwt.secret, { expiresIn: '1h' });

            return res.status(201)
                .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
                .json({
                    message: "User created successfully",
                    token,
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        name: `${newUser.firstname} ${newUser.lastname}`
                    }
                });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        console.error("Google OAuth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



//============================Password Forget============================
const forgetPasswordSchema = z.object({
    email: z.string().email()
});

const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6).max(100)
});

const COOLDOWN_PERIOD = 5 * 60 * 1000;


export const forgetPassword = async (req, res) => {
    try {
        const { email } = forgetPasswordSchema.parse(req.body);

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        if (user.lastPasswordResetRequest && Date.now() - user.lastPasswordResetRequest < COOLDOWN_PERIOD) {
            const timeLeft = Math.ceil((COOLDOWN_PERIOD - (Date.now() - user.lastPasswordResetRequest)) / 60000);
            return res.status(429).json({ message: `Please wait ${timeLeft} minutes before requesting another password reset.` });
        }

        const resetToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1h' });
        const resetTokenExpiry = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        user.lastPasswordResetRequest = Date.now();
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.nodemailer.email,
                pass: config.nodemailer.password
            }
        });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        console.log(user);

        const mailOptions = {
            from: '"noreply@fitVision.com" <your_actual_email@gmail.com>',
            to: user.email,
            subject: 'Password Reset Request - Fit Vision',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #f0f0f0; background-color: #f9f9f9;">
                <h2 style="text-align: center; color: #4a90e2;">Fit Vision</h2>
                <h3 style="color: #333;">Hello, ${user.firstname}</h3>
                <p>You requested a password reset for your Fit Vision account. Click the button below to reset your password.</p>
        
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetUrl}" style="background-color: #4a90e2; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Reset Password</a>
                </div>
        
                <p>If you didn’t request this, please ignore this email. This password reset link will expire in <strong>1 hour</strong>.</p>
                <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />
        
                <div style="text-align: center; color: #888;">
                    <p>Stay on track with your fitness goals with <strong>Fit Vision</strong>.</p>
                    <p style="font-size: 12px;">Fit Vision, Your Partner in Fitness. All rights reserved © 2024</p>
                </div>
            </div>
            `
        };


        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent to email" });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        console.error("Forget password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = resetPasswordSchema.parse(req.body);


        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(400).json({ message: "Password reset token has expired" });
            }
            return res.status(400).json({ message: "Invalid password reset token" });
        }

        const user = await UserModel.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found or reset token has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//============================Logout============================
export const signout = async (req, res) => {
    res.clearCookie('access_token').json({ message: "Logged out successfully" });
};