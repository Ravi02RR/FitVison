import { z } from 'zod';
import bcrypt from 'bcrypt';
import UserModel from '../Models/user.model.js';
import config from '../config/congif.js';
import jwt from 'jsonwebtoken';


//============================Signup============================

const signupSchema = z.object({
    username: z.string().min(3).max(30),
    firstname: z.string().min(2).max(50),
    lastname: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100)
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
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
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
                    name: `${validUser.firstname} ${validUser.lastname}`
                },
                validUser
            });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
