import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: String,
    sets: Number,
    reps: String,
    duration: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    },
});

const workoutPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    goal: {
        type: String,
        enum: ['Lose Fat', 'Maintain Health', 'Gain Muscle'],
    },
    exercises: [exerciseSchema],
}, { timestamps: true });

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export default WorkoutPlan;
