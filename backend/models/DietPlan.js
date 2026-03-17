import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
});

const dietPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    goal: {
        type: String,
        enum: ['Lose Fat', 'Maintain Health', 'Gain Muscle'],
    },
    dietPreference: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian'],
    },
    focus: String,
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snacks: mealSchema,
    totalCalories: Number,
}, { timestamps: true });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
export default DietPlan;
