import { Router } from 'express';
import subsModel from '../Models/subscribe.model.js';
import { z } from 'zod';
import config from '../config/congif.js';
import nodemailer from 'nodemailer';
import { checkAdminToken } from './admin.user.route.js';

const SubscribedRoute = Router();

const subsSchema = z.object({
    email: z.string().email("Invalid email address")
});

const emailSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    htmlContent: z.string().min(1, "HTML content is required")
});

SubscribedRoute.post('/', async (req, res) => {
    try {
        const validatedData = subsSchema.parse(req.body);

        const existing = await subsModel.findOne({
            Email: validatedData.email,
        });

        if (existing) {
            return res.status(400).json({
                message: "User already subscribed"
            });
        } else {
            const newSubscription = new subsModel({
                Email: validatedData.email
            });

            await newSubscription.save();

            return res.status(201).json({
                message: "Successfully subscribed",
                email: validatedData.email
            });
        }
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

        console.error("Subscription error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const email = config.nodemailer.email;
const pass = config.nodemailer.password;

SubscribedRoute.post('/email', checkAdminToken, async (req, res) => {
    try {
        const { subject, htmlContent } = emailSchema.parse(req.body);
        const subscribers = await subsModel.find({}, 'Email');
        const recipientEmails = subscribers.map(sub => sub.Email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: pass
            }
        });

        const mailOptions = {
            from: '"noreply@fitVision.com" <your_actual_email@gmail.com>',
            bcc: recipientEmails.join(','), 
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully to all subscribers" });
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

        console.error("Email sending error:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});


export default SubscribedRoute;