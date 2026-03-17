import User from '../models/User.js';

// Logic for generating diet plan
const generateDietPlan = (goal, category) => {
    let plan = {};

    if (goal === 'Lose Fat') {
        plan = {
            breakfast: { name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 55, fats: 8 },
            lunch: { name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 15, fats: 20 },
            dinner: { name: 'Baked Salmon with Asparagus', calories: 400, protein: 35, carbs: 10, fats: 22 },
            snacks: { name: 'Greek Yogurt or Roasted Chickpeas', calories: 150, protein: 15, carbs: 10, fats: 2 },
            focus: 'Calorie Deficit & High Protein'
        };
    } else if (goal === 'Gain Muscle') {
        plan = {
            breakfast: { name: 'Scrambled Eggs & Avocado Toast', calories: 550, protein: 25, carbs: 45, fats: 30 },
            lunch: { name: 'Chicken, Rice and Broccoli', calories: 700, protein: 45, carbs: 80, fats: 15 },
            dinner: { name: 'Beef Stir Fry with Noodles', calories: 650, protein: 40, carbs: 70, fats: 20 },
            snacks: { name: 'Protein Shake and Banana', calories: 300, protein: 30, carbs: 40, fats: 5 },
            focus: 'Calorie Surplus & High Protein/Carbs'
        };
    } else {
        plan = {
            breakfast: { name: 'Fruit Smoothie Bowl', calories: 400, protein: 10, carbs: 70, fats: 10 },
            lunch: { name: 'Quinoa Bowl with Roasted Veggies', calories: 500, protein: 18, carbs: 65, fats: 18 },
            dinner: { name: 'Lentil Soup with Whole Grain Bread', calories: 450, protein: 22, carbs: 60, fats: 12 },
            snacks: { name: 'Almonds and Apple', calories: 200, protein: 6, carbs: 20, fats: 14 },
            focus: 'Balanced Nutrition & Maintenance'
        };
    }

    return plan;
};

// Logic for generating workout plan
const generateWorkoutPlan = (goal) => {
    let workouts = [];

    if (goal === 'Lose Fat') {
        workouts = [
            { name: 'Morning Jog', sets: 1, reps: '30 mins', duration: '30m', difficulty: 'Medium' },
            { name: 'HIIT Circuit', sets: 4, reps: '15 reps', duration: '20m', difficulty: 'Hard' },
            { name: 'Jump Rope', sets: 5, reps: '2 mins', duration: '15m', difficulty: 'Medium' },
            { name: 'Plank', sets: 3, reps: '60 secs', duration: '5m', difficulty: 'Easy' }
        ];
    } else if (goal === 'Gain Muscle') {
        workouts = [
            { name: 'Bench Press', sets: 4, reps: '8-12', duration: '15m', difficulty: 'Hard' },
            { name: 'Squats', sets: 4, reps: '10-12', duration: '15m', difficulty: 'Hard' },
            { name: 'Deadlift', sets: 3, reps: '6-8', duration: '15m', difficulty: 'Expert' },
            { name: 'Pull-ups', sets: 3, reps: 'To failure', duration: '10m', difficulty: 'Hard' }
        ];
    } else {
        workouts = [
            { name: 'Brisk Walking', sets: 1, reps: '45 mins', duration: '45m', difficulty: 'Easy' },
            { name: 'Standard Pushups', sets: 3, reps: '15-20', duration: '10m', difficulty: 'Medium' },
            { name: 'Bodyweight Squats', sets: 3, reps: '20', duration: '10m', difficulty: 'Medium' },
            { name: 'Yoga / Stretching', sets: 1, reps: '20 mins', duration: '20m', difficulty: 'Easy' }
        ];
    }

    return workouts;
};

// @desc    Get recommendations based on profile
// @route   GET /api/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user || !user.fitnessGoal) {
            return res.status(400).json({ message: 'Please complete your profile first' });
        }

        const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
        let category = '';
        if (bmi < 18.5) category = 'underweight';
        else if (bmi < 25) category = 'normal';
        else if (bmi < 30) category = 'overweight';
        else category = 'obese';

        const dietPlan = generateDietPlan(user.fitnessGoal, category);
        const workoutPlan = generateWorkoutPlan(user.fitnessGoal);

        res.json({
            diet: dietPlan,
            workout: workoutPlan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
