import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

// Helper function
const generateDietPlanLogic = (goal, category) => {
    let plan = {};
    if (goal === 'Lose Fat') {
        plan = {
            breakfast: { name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 55, fats: 8 },
            lunch: { name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 15, fats: 20 },
            dinner: { name: 'Baked Salmon with Asparagus', calories: 400, protein: 35, carbs: 10, fats: 22 },
            snacks: { name: 'Greek Yogurt or Roasted Chickpeas', calories: 150, protein: 15, carbs: 10, fats: 2 },
            focus: 'Calorie Deficit & High Protein',
            totalCalories: 1350
        };
    } else if (goal === 'Gain Muscle') {
        plan = {
            breakfast: { name: 'Scrambled Eggs & Avocado Toast', calories: 550, protein: 25, carbs: 45, fats: 30 },
            lunch: { name: 'Chicken, Rice and Broccoli', calories: 700, protein: 45, carbs: 80, fats: 15 },
            dinner: { name: 'Beef Stir Fry with Noodles', calories: 650, protein: 40, carbs: 70, fats: 20 },
            snacks: { name: 'Protein Shake and Banana', calories: 300, protein: 30, carbs: 40, fats: 5 },
            focus: 'Calorie Surplus & High Protein/Carbs',
            totalCalories: 2200
        };
    } else {
        plan = {
            breakfast: { name: 'Fruit Smoothie Bowl', calories: 400, protein: 10, carbs: 70, fats: 10 },
            lunch: { name: 'Quinoa Bowl with Roasted Veggies', calories: 500, protein: 18, carbs: 65, fats: 18 },
            dinner: { name: 'Lentil Soup with Whole Grain Bread', calories: 450, protein: 22, carbs: 60, fats: 12 },
            snacks: { name: 'Almonds and Apple', calories: 200, protein: 6, carbs: 20, fats: 14 },
            focus: 'Balanced Nutrition & Maintenance',
            totalCalories: 1550
        };
    }
    return plan;
};

// @desc    Generate or Get current Diet Plan
// @route   GET /api/diet
// @access  Private
export const getDietPlan = async (req, res) => {
    try {
        let dietPlan = await DietPlan.findOne({ user: req.user._id }).sort({ createdAt: -1 });

        if (!dietPlan) {
            // Generate a new one if it doesn't exist
            const user = await User.findById(req.user._id);
            if (!user.fitnessGoal) {
                return res.status(400).json({ message: 'Please complete your profile first' });
            }

            const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
            let category = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';
            
            const rawPlan = generateDietPlanLogic(user.fitnessGoal, category);
            
            dietPlan = await DietPlan.create({
                user: req.user._id,
                goal: user.fitnessGoal,
                ...rawPlan
            });
        }

        res.json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a custom diet plan
// @route   POST /api/diet
// @access  Private
export const createDietPlan = async (req, res) => {
    try {
        const { goal, focus, breakfast, lunch, dinner, snacks, totalCalories } = req.body;
        
        const dietPlan = await DietPlan.create({
            user: req.user._id,
            goal,
            focus,
            breakfast,
            lunch,
            dinner,
            snacks,
            totalCalories
        });

        res.status(201).json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a diet plan
// @route   PUT /api/diet/:id
// @access  Private
export const updateDietPlan = async (req, res) => {
    try {
        let dietPlan = await DietPlan.findById(req.params.id);

        if (!dietPlan) {
            return res.status(404).json({ message: 'Diet Plan not found' });
        }

        // Make sure user owns the plan
        if (dietPlan.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        dietPlan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a diet plan
// @route   DELETE /api/diet/:id
// @access  Private
export const deleteDietPlan = async (req, res) => {
    try {
        const dietPlan = await DietPlan.findById(req.params.id);

        if (!dietPlan) {
            return res.status(404).json({ message: 'Diet Plan not found' });
        }

        if (dietPlan.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await dietPlan.deleteOne();
        res.json({ message: 'Diet Plan removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
