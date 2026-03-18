import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
});

const mealOptionSchema = new mongoose.Schema({
    selected: mealSchema,
    alternatives: [mealSchema]
});

const dietPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
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
    breakfast: mealOptionSchema,
    lunch: mealOptionSchema,
    dinner: mealOptionSchema,
    snacks: mealOptionSchema,
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFats: Number,
}, { timestamps: true });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
export default DietPlan;
