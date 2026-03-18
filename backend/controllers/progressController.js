import Progress from '../models/Progress.js';

// @desc    Create a daily progress log
// @route   POST /api/progress
// @access  Private
export const createLog = async (req, res) => {
    try {
        const { weight, caloriesConsumed, waterIntake, workoutCompleted, date } = req.body;

        const logDate = date ? new Date(date) : new Date();
        logDate.setHours(0, 0, 0, 0);

        // Check if log for today already exists
        let log = await Progress.findOne({
            user: req.user._id,
            date: {
                $gte: logDate,
                $lt: new Date(logDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (log) {
            log.weight = weight || log.weight;
            log.caloriesConsumed = caloriesConsumed || log.caloriesConsumed;
            log.waterIntake = waterIntake || log.waterIntake;
            log.workoutCompleted = workoutCompleted !== undefined ? workoutCompleted : log.workoutCompleted;
            const updatedLog = await log.save();
            return res.json(updatedLog);
        }

        const newLog = await Progress.create({
            user: req.user._id,
            weight,
            caloriesConsumed,
            waterIntake,
            workoutCompleted,
            date: logDate
        });

        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all progress logs for a user with Search, Filter, Sort, and Pagination
// @route   GET /api/progress
// @access  Private
export const getLogs = async (req, res) => {
    try {
        const { search, sortBy, order, page = 1, limit = 10 } = req.query;

        let query = { user: req.user._id };

        // Search logic
        if (search) {
            query.$or = [
                { weight: isNaN(search) ? undefined : Number(search) },
            ].filter(q => q.weight !== undefined);
        }

        // Sorting
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.date = -1;
        }

        // Pagination
        const skip = (page - 1) * limit;

        const logs = await Progress.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const total = await Progress.countDocuments(query);

        res.json({
            logs,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a progress log
// @route   DELETE /api/progress/:id
// @access  Private
export const deleteLog = async (req, res) => {
    try {
        const log = await Progress.findById(req.params.id);

        if (log && log.user.toString() === req.user._id.toString()) {
            await log.deleteOne();
            res.json({ message: 'Log removed' });
        } else {
            res.status(404).json({ message: 'Log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/progress/stats
// @access  Private
export const getStats = async (req, res) => {
    try {
        const logs = await Progress.find({ user: req.user._id }).sort({ date: 1 });
        
        if (logs.length === 0) {
            return res.json({
                startWeight: 0,
                currentWeight: 0,
                progressPercentage: 0,
                streak: 0,
                history: []
            });
        }

        const startWeight = logs[0].weight;
        const currentWeight = logs[logs.length - 1].weight;
        const targetWeight = req.user.targetWeight || startWeight;

        let progressPercentage = 0;
        if (startWeight !== targetWeight) {
            progressPercentage = Math.min(100, Math.max(0, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)));
        }

        // Calculate Streak — resets to 0 if a day is missed
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Walk backwards from today to count consecutive completed days
        for (let i = logs.length - 1; i >= 0; i--) {
            const logDate = new Date(logs[i].date);
            logDate.setHours(0, 0, 0, 0);
            const diffInDays = Math.round((today - logDate) / (1000 * 60 * 60 * 24));

            if (diffInDays === streak) {
                // This log is for the expected day in the streak
                if (logs[i].workoutCompleted) {
                    streak++;
                } else {
                    // Day exists but workout was missed — streak resets
                    break;
                }
            } else if (diffInDays > streak) {
                // Gap in days means a day was skipped — streak resets
                break;
            }
        }

        res.json({
            startWeight,
            currentWeight,
            targetWeight,
            progressPercentage,
            streak,
            history: logs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
