import { Router } from 'express';
import progressModel from '../Models/progress.model.js';
import userModel from '../Models/user.model.js';
import { checkAdminToken } from './admin.user.route.js';

const AdminProgressRouter = Router();

const calculatePercentage = (part, whole) => {
    return whole > 0 ? ((part / whole) * 100).toFixed(2) : '0.00';
};


const retryOperation = async (operation, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (error.name === 'VersionError' && attempt < maxRetries) {
                console.log(`VersionError encountered, retrying (attempt ${attempt + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
            } else {
                throw error;
            }
        }
    }
};

AdminProgressRouter.use(checkAdminToken);
AdminProgressRouter.get('/overall-stats', async (req, res) => {
    try {
        const stats = await retryOperation(async () => {
            const totalUsers = await userModel.countDocuments();
            const usersWithProgress = await progressModel.countDocuments();
            const allProgress = await progressModel.find();

            let totalWeightLoss = 0;
            let usersAchievedTarget = 0;
            let totalEntries = 0;
            let totalStreakDays = 0;

            allProgress.forEach(progress => {
                const entries = progress.entries;
                if (entries && entries.length > 0) {
                    const firstEntry = entries[0];
                    const lastEntry = entries[entries.length - 1];
                    totalWeightLoss += firstEntry.currentWeight - lastEntry.currentWeight;
                    if (lastEntry.currentWeight <= firstEntry.targetWeight) {
                        usersAchievedTarget++;
                    }
                    totalEntries += entries.length;
                    totalStreakDays += progress.streak || 0;
                }
            });

            const averageWeightLoss = usersWithProgress > 0 ? totalWeightLoss / usersWithProgress : 0;
            const averageEntries = usersWithProgress > 0 ? totalEntries / usersWithProgress : 0;
            const averageStreak = usersWithProgress > 0 ? totalStreakDays / usersWithProgress : 0;

            return {
                totalUsers,
                usersTrackingProgress: usersWithProgress,
                percentageUsersTracking: calculatePercentage(usersWithProgress, totalUsers),
                averageWeightLoss,
                averageEntries,
                averageStreak,
                usersAchievedTarget,
                percentageAchievedTarget: calculatePercentage(usersAchievedTarget, usersWithProgress)
            };
        });

        res.json(stats);
    } catch (error) {
        console.error("Error in /overall-stats:", error);
        res.status(500).json({ message: "Error fetching overall stats", error: error.message });
    }
});

AdminProgressRouter.get('/leaderboard/weight-loss', async (req, res) => {
    try {
        const leaderboard = await retryOperation(async () => {
            return progressModel.aggregate([
                {
                    $match: {
                        entries: { $exists: true, $ne: [] }
                    }
                },
                {
                    $addFields: {
                        weightLoss: {
                            $subtract: [
                                { $arrayElemAt: ["$entries.currentWeight", 0] },
                                { $arrayElemAt: ["$entries.currentWeight", -1] }
                            ]
                        }
                    }
                },
                { $sort: { weightLoss: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        username: '$userDetails.username',
                        weightLoss: 1,
                        initialWeight: { $arrayElemAt: ["$entries.currentWeight", 0] },
                        currentWeight: { $arrayElemAt: ["$entries.currentWeight", -1] },
                        streak: 1
                    }
                }
            ]);
        });

        res.json(leaderboard);
    } catch (error) {
        console.error("Error in /leaderboard/weight-loss:", error);
        res.status(500).json({ message: "Error fetching weight loss leaderboard", error: error.message });
    }
});

AdminProgressRouter.get('/leaderboard/streak', async (req, res) => {
    try {
        const leaderboard = await retryOperation(async () => {
            return progressModel.aggregate([
                {
                    $match: {
                        streak: { $exists: true, $gt: 0 }
                    }
                },
                { $sort: { streak: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        username: '$userDetails.username',
                        streak: 1,
                        lastUpdated: 1
                    }
                }
            ]);
        });

        res.json(leaderboard);
    } catch (error) {
        console.error("Error in /leaderboard/streak:", error);
        res.status(500).json({ message: "Error fetching streak leaderboard", error: error.message });
    }
});

AdminProgressRouter.get('/progress-distribution', async (req, res) => {
    try {
        const distribution = await retryOperation(async () => {
            const allProgress = await progressModel.find({ entries: { $exists: true, $ne: [] } });
            const distribution = {
                weightLossRanges: {
                    "0-5kg": 0,
                    "5-10kg": 0,
                    "10-20kg": 0,
                    "20kg+": 0
                },
                bmiCategories: {
                    Underweight: 0,
                    Normal: 0,
                    Overweight: 0,
                    Obese: 0
                },
                streakRanges: {
                    "1-7 days": 0,
                    "8-30 days": 0,
                    "31-90 days": 0,
                    "90+ days": 0
                }
            };

            allProgress.forEach(progress => {
                const entries = progress.entries;
                if (entries && entries.length > 0) {
                    const weightLoss = entries[0].currentWeight - entries[entries.length - 1].currentWeight;
                    if (weightLoss <= 5) distribution.weightLossRanges["0-5kg"]++;
                    else if (weightLoss <= 10) distribution.weightLossRanges["5-10kg"]++;
                    else if (weightLoss <= 20) distribution.weightLossRanges["10-20kg"]++;
                    else distribution.weightLossRanges["20kg+"]++;

                    const lastStatus = entries[entries.length - 1].status;
                    if (lastStatus) distribution.bmiCategories[lastStatus]++;

                    const streak = progress.streak || 0;
                    if (streak <= 7) distribution.streakRanges["1-7 days"]++;
                    else if (streak <= 30) distribution.streakRanges["8-30 days"]++;
                    else if (streak <= 90) distribution.streakRanges["31-90 days"]++;
                    else distribution.streakRanges["90+ days"]++;
                }
            });

            return distribution;
        });

        res.json(distribution);
    } catch (error) {
        console.error("Error in /progress-distribution:", error);
        res.status(500).json({ message: "Error fetching progress distribution", error: error.message });
    }
});

AdminProgressRouter.get('/monthly-trends', async (req, res) => {
    try {
        const trends = await retryOperation(async () => {
            const allProgress = await progressModel.find({ entries: { $exists: true, $ne: [] } });
            const trends = Array(12).fill().map(() => ({
                totalWeightLoss: 0,
                totalEntries: 0,
                activeUsers: 0
            }));

            allProgress.forEach(progress => {
                const entries = progress.entries;
                if (entries && entries.length > 0) {
                    entries.forEach((entry, index) => {
                        if (entry.date) {
                            const monthIndex = entry.date.getMonth();
                            if (index > 0) {
                                const weightLoss = entries[index - 1].currentWeight - entry.currentWeight;
                                trends[monthIndex].totalWeightLoss += weightLoss;
                                trends[monthIndex].totalEntries++;
                            }
                            trends[monthIndex].activeUsers++;
                        }
                    });
                }
            });

            return trends;
        });

        res.json(trends);
    } catch (error) {
        console.error("Error in /monthly-trends:", error);
        res.status(500).json({ message: "Error fetching monthly trends", error: error.message });
    }
});

export default AdminProgressRouter;