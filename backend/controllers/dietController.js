import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';
import { generateDietPlanLogic } from '../utils/dietDataUtils.js';

// @desc    Generate or Get current Diet Plan
// @route   GET /api/diet
// @access  Private
export const getDietPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Find the most recent diet plan for this user
        let dietPlan = await DietPlan.findOne({ user: req.user._id }).sort({ createdAt: -1 });

        const isToday = (date) => {
            const d = new Date(date);
            const now = new Date();
            return d.getDate() === now.getDate() && 
                   d.getMonth() === now.getMonth() && 
                   d.getFullYear() === now.getFullYear();
        };

        let shouldGenerate = !dietPlan || !isToday(dietPlan.createdAt);
        
        // Also regenerate if goal/preference changed
        if (!shouldGenerate) {
            if (user.fitnessGoal && dietPlan.goal !== user.fitnessGoal) shouldGenerate = true;
            if (user.dietPreference && dietPlan.dietPreference !== user.dietPreference) shouldGenerate = true;
        }

        if (shouldGenerate) {
            if (!user.fitnessGoal) {
                return res.status(400).json({ message: 'Please complete your profile first' });
            }

            const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
            let category = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';
            
            const rawPlan = generateDietPlanLogic(user.fitnessGoal, category, user.dietPreference);
            
            dietPlan = await DietPlan.create({
                user: req.user._id,
                date: new Date(),
                goal: user.fitnessGoal,
                dietPreference: user.dietPreference,
                ...rawPlan
            });
        }

        res.json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Regenerate a specific meal type
// @route   PUT /api/diet/regenerate/:mealType
// @access  Private
export const regenerateMeal = async (req, res) => {
    try {
        const { mealType } = req.params; // 'breakfast', 'lunch', 'dinner', 'snacks'
        
        // Find today's plan
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let dietPlan = await DietPlan.findOne({ 
            user: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!dietPlan) {
            return res.status(404).json({ message: 'No diet plan found for today' });
        }

        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
            return res.status(400).json({ message: 'Invalid meal type' });
        }

        const currentMealData = dietPlan[mealType];
        
        if (currentMealData.alternatives && currentMealData.alternatives.length > 0) {
            // Swap selected with the first alternative, and push the old selected to the end of alternatives
            const oldSelected = currentMealData.selected;
            const newSelected = currentMealData.alternatives[0];
            const newAlternatives = [...currentMealData.alternatives.slice(1), oldSelected];

            dietPlan[mealType] = {
                selected: newSelected,
                alternatives: newAlternatives
            };

            // Recalculate total calories and macros
            dietPlan.totalCalories = 
                dietPlan.breakfast.selected.calories + 
                dietPlan.lunch.selected.calories + 
                dietPlan.dinner.selected.calories + 
                dietPlan.snacks.selected.calories;
            
            dietPlan.totalProtein = 
                dietPlan.breakfast.selected.protein + 
                dietPlan.lunch.selected.protein + 
                dietPlan.dinner.selected.protein + 
                dietPlan.snacks.selected.protein;
            
            dietPlan.totalCarbs = 
                dietPlan.breakfast.selected.carbs + 
                dietPlan.lunch.selected.carbs + 
                dietPlan.dinner.selected.carbs + 
                dietPlan.snacks.selected.carbs;
            
            dietPlan.totalFats = 
                dietPlan.breakfast.selected.fats + 
                dietPlan.lunch.selected.fats + 
                dietPlan.dinner.selected.fats + 
                dietPlan.snacks.selected.fats;

            await dietPlan.save();
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
            date: new Date(),
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
