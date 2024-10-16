import { Router } from 'express';
import { model, Schema } from 'mongoose';
import UserModel from '../Models/user.model.js';
import { checkAdminToken } from './admin.user.route.js';

const reqperuser = Router();

const RequestStatSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String },
    email: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    isPro: { type: Boolean },
    proExpirationDate: { type: Date },
    total: { type: Number, default: 0 },
    success: { type: Number, default: 0 },
    error: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    firstRequest: { type: Date },
    lastRequest: { type: Date },
    ipAddresses: [{ type: String }],
    userAgent: { type: String },
    requestDetails: [{
        method: String,
        path: String,
        timestamp: Date,
        statusCode: Number,
        queryParams: Object,
        bodyParams: Object
    }]
});

const RequestStat = model('RequestStat', RequestStatSchema);

const trackRequests = async (req, res, next) => {
    const userId = req.userID || 'systemcalls';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    try {
        let user = null;
        if (userId !== 'systemcalls') {
            user = await UserModel.findById(userId);
        }

        const originalEnd = res.end;
        res.end = async function (...args) {
            const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
            const sanitizedBody = { ...req.body };
            if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';

            const newRequestDetail = {
                method: req.method,
                path: req.path,
                timestamp: new Date(),
                statusCode: res.statusCode,
                queryParams: req.query,
                bodyParams: sanitizedBody
            };

            try {
                const result = await RequestStat.findOneAndUpdate(
                    { userId },
                    {
                        $setOnInsert: {
                            userId,
                            username: user?.username,
                            email: user?.email,
                            firstname: user?.firstname,
                            lastname: user?.lastname,
                            isPro: user?.isPro,
                            proExpirationDate: user?.proExpirationDate,
                            firstRequest: new Date()
                        },
                        $set: {
                            lastUpdated: new Date(),
                            lastRequest: new Date(),
                            userAgent
                        },
                        $inc: {
                            total: 1,
                            success: isSuccess ? 1 : 0,
                            error: isSuccess ? 0 : 1
                        },
                        $addToSet: { ipAddresses: ipAddress },
                        $push: {
                            requestDetails: {
                                $each: [newRequestDetail],
                                $slice: -100  // Keep only the last 100 requests
                            }
                        }
                    },
                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }
                );

                if (!result) {
                    console.error('Failed to update or create RequestStat');
                }
            } catch (error) {
                console.error('Error updating RequestStat:', error);
            }

            originalEnd.apply(res, args);
        };

        next();
    } catch (error) {
        console.error('Error in trackRequests middleware:', error);
        next(error);
    }
};

reqperuser.use(trackRequests);
reqperuser.use(checkAdminToken);

reqperuser.get('/request-stats', async (req, res) => {
    try {
        const stats = await RequestStat.find({}, '-requestDetails');
        res.json(stats);
    } catch (error) {
        console.error('Error fetching request statistics:', error);
        res.status(500).json({ message: 'Error fetching request statistics', error: error.message });
    }
});

reqperuser.get('/request-stats/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userStats = await RequestStat.findOne({ userId });

        if (userStats) {
            res.json(userStats);
        } else {
            res.status(404).json({ message: 'User statistics not found' });
        }
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
    }
});

reqperuser.get('/detailed-stats', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'total', order = 'desc', search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { userId: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

        const users = await RequestStat.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit))
            .select('-requestDetails');

        const total = await RequestStat.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalUsers: total
        });
    } catch (error) {
        console.error('Error fetching detailed user statistics:', error);
        res.status(500).json({ message: 'Error fetching detailed user statistics', error: error.message });
    }
});

export { reqperuser, trackRequests };