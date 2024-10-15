import Progress from "../Models/progress.model.js";

const calculateBMI = (weight, height) => {
    return (weight / ((height / 100) ** 2)).toFixed(2);
};

const determineStatus = (BMI) => {
    if (BMI < 18.5) return 'Underweight';
    if (BMI >= 18.5 && BMI < 24.9) return 'Normal';
    if (BMI >= 25 && BMI < 29.9) return 'Overweight';
    return 'Obese';
};

const calculateWeightLossPercentage = (currentWeight, lastWeight) => {
    if (lastWeight === 0) return 0;
    return (((lastWeight - currentWeight) / lastWeight) * 100).toFixed(2);
};

export const addProgress = async (req, res) => {
    try {
        const { currentWeight, targetWeight, height } = req.body;
        const userId = req.userID;

        let progress = await Progress.findOne({ user: userId });

        if (!progress) {
            progress = new Progress({ user: userId, entries: [], streak: 1 });
        }

        const BMI = calculateBMI(currentWeight, height);
        const status = determineStatus(BMI);

        const lastEntry = progress.entries[progress.entries.length - 1];
        const weightLossPercentage = lastEntry
            ? calculateWeightLossPercentage(currentWeight, lastEntry.currentWeight)
            : 0;

        const lastUpdate = progress.lastUpdated ? new Date(progress.lastUpdated).toDateString() : null;
        const today = new Date().toDateString();

        if (lastUpdate !== today) {
            if (progress.entries.length > 0) {
                progress.streak += 1;
            }

        } else {

            progress.streak = 1;
        }

        progress.entries.push({
            currentWeight,
            targetWeight,
            height,
            BMI,
            status,
            streak: progress.streak
        });

        progress.lastUpdated = new Date();

        await progress.save();

        res.status(201).json({
            message: 'Progress added successfully',
            progress: {
                streak: progress.streak,
                weightLossPercentage,
                currentEntry: {
                    currentWeight,
                    targetWeight,
                    height,
                    BMI,
                    status
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.userID });

        if (!progress) {
            return res.status(404).json({ message: 'No progress found' });
        }

        const lastEntry = progress.entries[progress.entries.length - 1];
        const weightLossPercentage = lastEntry && progress.entries.length > 1
            ? calculateWeightLossPercentage(lastEntry.currentWeight, progress.entries[progress.entries.length - 2].currentWeight)
            : 0;

        res.status(200).json({
            progress: {
                streak: progress.streak,
                weightLossPercentage,
                entries: progress.entries
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};