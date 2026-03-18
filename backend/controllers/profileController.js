import User from '../models/User.js';

// @desc    Update user profile and calculate BMI/Calories
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { age, height, weight, gender, activityLevel, fitnessGoal, targetWeight, dietPreference } = req.body;

        // Build update object — only include fields that were actually provided
        const updateFields = {};
        if (age !== '' && age !== undefined) updateFields.age = Number(age);
        if (height !== '' && height !== undefined) updateFields.height = Number(height);
        if (weight !== '' && weight !== undefined) updateFields.weight = Number(weight);
        if (gender) updateFields.gender = gender;
        if (activityLevel) updateFields.activityLevel = activityLevel;
        if (fitnessGoal) updateFields.fitnessGoal = fitnessGoal;
        if (targetWeight !== '' && targetWeight !== undefined) updateFields.targetWeight = Number(targetWeight);
        if (dietPreference) updateFields.dietPreference = dietPreference;

        // Use findByIdAndUpdate — bypasses pre-save hook (no password re-hash)
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate Health Metrics
        const bmi = updatedUser.height && updatedUser.weight
            ? (updatedUser.weight / ((updatedUser.height / 100) ** 2)).toFixed(1)
            : null;

        let category = '';
        if (bmi) {
            if (bmi < 18.5) category = 'underweight';
            else if (bmi < 25) category = 'normal';
            else if (bmi < 30) category = 'overweight';
            else category = 'obese';
        }

        // BMR - Harris-Benedict
        let bmr = 0;
        if (updatedUser.gender === 'Male') {
            bmr = 88.362 + (13.397 * updatedUser.weight) + (4.799 * updatedUser.height) - (5.677 * updatedUser.age);
        } else if (updatedUser.gender) {
            bmr = 447.593 + (9.247 * updatedUser.weight) + (3.098 * updatedUser.height) - (4.330 * updatedUser.age);
        }

        let multiplier = 1.2;
        switch (updatedUser.activityLevel) {
            case 'Sedentary': multiplier = 1.2; break;
            case 'Lightly Active': multiplier = 1.375; break;
            case 'Moderately Active': multiplier = 1.55; break;
            case 'Very Active': multiplier = 1.725; break;
            case 'Super Active': multiplier = 1.9; break;
        }
        const tdee = bmr ? Math.round(bmr * multiplier) : 0;

        let dailyCalories = tdee;
        if (updatedUser.fitnessGoal === 'Lose Fat') dailyCalories -= 500;
        else if (updatedUser.fitnessGoal === 'Gain Muscle') dailyCalories += 500;

        res.json({
            ...updatedUser.toObject(),
            bmi,
            category,
            dailyCalories
        });
    } catch (error) {
        console.error('Profile update error:', error.message);
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
