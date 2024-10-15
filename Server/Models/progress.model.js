import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entries: [
        {
            currentWeight: {
                type: Number,
                required: true
            },
            targetWeight: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true 
            },
            BMI: {
                type: Number,
            },
            status: {
                type: String,
                enum: ['Normal', 'Overweight', 'Obese', 'Underweight'],
                default: 'Normal'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    streak: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Progress', progressSchema);