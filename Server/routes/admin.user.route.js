import { Router } from 'express';
import UserModel from '../Models/user.model.js';
import { z } from 'zod';

const adminUserRouter = Router();


export const checkAdminToken = (req, res, next) => {
    const adminToken = req.headers.admintoken;

    if (!adminToken) {
        return res.status(401).json({ message: "Required admin passkey" });
    }

    if (adminToken !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
};


adminUserRouter.use(checkAdminToken);


adminUserRouter.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


adminUserRouter.get('/users/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// const updateUserSchema = z.object({
//     username: z.string().min(3).max(30).optional(),
//     firstname: z.string().min(2).max(50).optional(),
//     lastname: z.string().min(2).max(50).optional(),
//     email: z.string().email().optional(),
//     isPro: z.boolean().optional(),
//     proExpirationDate: z.date().nullable().optional(),
//     photoURL: z.string().url().optional()
// });

const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    isPro: z.boolean().optional(),
    proExpirationDate: z.string().nullable().refine(
        (val) => val === null || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ).optional(),
}).strict();

adminUserRouter.put('/users/:userId', async (req, res) => {
    try {
        console.log(req.body);
        const validatedData = updateUserSchema.parse(req.body);
        // console.log(validatedData);


        if (validatedData.proExpirationDate) {
            validatedData.proExpirationDate = new Date(validatedData.proExpirationDate);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.userId,
            validatedData,
            { new: true, runValidators: true }
        ).select('-password');


        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: updatedUser, message: "User updated successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

adminUserRouter.delete('/users/:userId', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default adminUserRouter;