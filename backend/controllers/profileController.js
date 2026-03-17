import User from '../models/User.js';

// @desc    Update user profile and calculate BMI/Calories
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { age, height, weight, gender, activityLevel, fitnessGoal, targetWeight, dietPreference } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.age = age || user.age;
            user.height = height || user.height;
            user.weight = weight || user.weight;
            user.gender = gender || user.gender;
            user.activityLevel = activityLevel || user.activityLevel;
            user.fitnessGoal = fitnessGoal || user.fitnessGoal;
            user.targetWeight = targetWeight || user.targetWeight;
            user.dietPreference = dietPreference || user.dietPreference;

            const updatedUser = await user.save();

            // Calculate Health Metrics
            const bmi = (updatedUser.weight / ((updatedUser.height / 100) ** 2)).toFixed(1);
            let category = '';
            if (bmi < 18.5) category = 'underweight';
            else if (bmi < 25) category = 'normal';
            else if (bmi < 30) category = 'overweight';
            else category = 'obese';

            // Basal Metabolic Rate (BMR) - Harris-Benedict Equation
            let bmr = 0;
            if (updatedUser.gender === 'Male') {
                bmr = 88.362 + (13.397 * updatedUser.weight) + (4.799 * updatedUser.height) - (5.677 * updatedUser.age);
            } else {
                bmr = 447.593 + (9.247 * updatedUser.weight) + (3.098 * updatedUser.height) - (4.330 * updatedUser.age);
            }

            // Total Daily Energy Expenditure (TDEE)
            let multiplier = 1.2;
            switch (updatedUser.activityLevel) {
                case 'Sedentary': multiplier = 1.2; break;
                case 'Lightly Active': multiplier = 1.375; break;
                case 'Moderately Active': multiplier = 1.55; break;
                case 'Very Active': multiplier = 1.725; break;
                case 'Super Active': multiplier = 1.9; break;
            }
            const tdee = Math.round(bmr * multiplier);

            // Goal adjustment
            let dailyCalories = tdee;
            if (updatedUser.fitnessGoal === 'Lose Fat') dailyCalories -= 500;
            else if (updatedUser.fitnessGoal === 'Gain Muscle') dailyCalories += 500;

            res.json({
                ...updatedUser.toObject(),
                bmi,
                category,
                dailyCalories
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user health metrics
// @route   GET /api/profile/metrics
// @access  Private
export const getProfileMetrics = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || !user.height || !user.weight) {
            return res.status(200).json({ incomplete: true });
        }

        const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
        let category = '';
        if (bmi < 18.5) category = 'underweight';
        else if (bmi < 25) category = 'normal';
        else if (bmi < 30) category = 'overweight';
        else category = 'obese';

        let bmr = 0;
        if (user.gender === 'Male') {
            bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
        } else {
            bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
        }

        let multiplier = 1.2;
        switch (user.activityLevel) {
            case 'Sedentary': multiplier = 1.2; break;
            case 'Lightly Active': multiplier = 1.375; break;
            case 'Moderately Active': multiplier = 1.55; break;
            case 'Very Active': multiplier = 1.725; break;
            case 'Super Active': multiplier = 1.9; break;
        }
        const tdee = Math.round(bmr * multiplier);
        let dailyCalories = tdee;
        if (user.fitnessGoal === 'Lose Fat') dailyCalories -= 500;
        else if (user.fitnessGoal === 'Gain Muscle') dailyCalories += 500;

        res.json({ bmi, category, dailyCalories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
