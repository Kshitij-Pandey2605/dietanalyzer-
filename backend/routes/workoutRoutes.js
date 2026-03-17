import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
    getWorkoutPlan, 
    createWorkoutPlan, 
    updateWorkoutPlan, 
    deleteWorkoutPlan 
} from '../controllers/workoutController.js';

const router = express.Router();

router.route('/')
    .get(protect, getWorkoutPlan)
    .post(protect, createWorkoutPlan);

router.route('/:id')
    .put(protect, updateWorkoutPlan)
    .delete(protect, deleteWorkoutPlan);

export default router;
