import WorkoutPlan from '../models/WorkoutPlan.js';
import User from '../models/User.js';

// Helper function
const generateWorkoutPlanLogic = (goal) => {
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

// @desc    Generate or Get current Workout Plan
// @route   GET /api/workout
// @access  Private
export const getWorkoutPlan = async (req, res) => {
    try {
        let workoutPlan = await WorkoutPlan.findOne({ user: req.user._id }).sort({ createdAt: -1 });

        if (!workoutPlan) {
            const user = await User.findById(req.user._id);
            if (!user.fitnessGoal) {
                return res.status(400).json({ message: 'Please complete your profile first' });
            }

            const exercises = generateWorkoutPlanLogic(user.fitnessGoal);
            
            workoutPlan = await WorkoutPlan.create({
                user: req.user._id,
                goal: user.fitnessGoal,
                exercises
            });
        }

        res.json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a custom workout plan
// @route   POST /api/workout
// @access  Private
export const createWorkoutPlan = async (req, res) => {
    try {
        const { goal, exercises } = req.body;
        
        const workoutPlan = await WorkoutPlan.create({
            user: req.user._id,
            goal,
            exercises
        });

        res.status(201).json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a workout plan
// @route   PUT /api/workout/:id
// @access  Private
export const updateWorkoutPlan = async (req, res) => {
    try {
        let workoutPlan = await WorkoutPlan.findById(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({ message: 'Workout Plan not found' });
        }

        if (workoutPlan.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        workoutPlan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a workout plan
// @route   DELETE /api/workout/:id
// @access  Private
export const deleteWorkoutPlan = async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findById(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({ message: 'Workout Plan not found' });
        }

        if (workoutPlan.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await workoutPlan.deleteOne();
        res.json({ message: 'Workout Plan removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
