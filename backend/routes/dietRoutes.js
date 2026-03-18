import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
    getDietPlan, 
    createDietPlan, 
    updateDietPlan, 
    deleteDietPlan,
    regenerateMeal
} from '../controllers/dietController.js';

const router = express.Router();

router.route('/')
    .get(protect, getDietPlan)
    .post(protect, createDietPlan);

router.route('/regenerate/:mealType')
    .put(protect, regenerateMeal);

router.route('/:id')
    .put(protect, updateDietPlan)
    .delete(protect, deleteDietPlan);

export default router;
