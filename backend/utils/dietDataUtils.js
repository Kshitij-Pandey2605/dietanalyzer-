export const generateDietPlanLogic = (goal, category, preference) => {
    const isVeg = preference === 'Vegetarian';

    const getOptions = (mealTime) => {
        if (goal === 'Lose Fat') {
            if (isVeg) {
                return {
                    breakfast: [
                        { name: 'Paneer Bhurji with 1 Brown Bread', calories: 300, protein: 18, carbs: 25, fats: 14 },
                        { name: 'Moong Dal Chilla with Mint Chutney', calories: 280, protein: 15, carbs: 30, fats: 10 },
                        { name: 'Greek Yogurt with Mixed Berries', calories: 250, protein: 20, carbs: 20, fats: 5 }
                    ],
                    lunch: [
                        { name: 'Lentil Soup with Quinoa Salad', calories: 400, protein: 20, carbs: 50, fats: 12 },
                        { name: 'Soya Chunk Curry with Brown Rice', calories: 420, protein: 25, carbs: 45, fats: 10 },
                        { name: 'Tofu Sabzi with 2 Multigrain Rotis', calories: 380, protein: 22, carbs: 40, fats: 12 }
                    ],
                    dinner: [
                        { name: 'Roasted Tofu with Sautéed Veggies', calories: 350, protein: 22, carbs: 15, fats: 18 },
                        { name: 'Mixed Veg Soup with Salad', calories: 250, protein: 10, carbs: 30, fats: 8 },
                        { name: 'Mushroom Stir-fry with Green Beans', calories: 300, protein: 15, carbs: 25, fats: 12 }
                    ],
                    snacks: [
                        { name: 'Greek Yogurt or Roasted Chickpeas', calories: 150, protein: 15, carbs: 10, fats: 2 },
                        { name: '1 Apple with 1tbsp Peanut Butter', calories: 180, protein: 5, carbs: 20, fats: 8 },
                        { name: 'Handful of Mixed Nuts', calories: 160, protein: 5, carbs: 5, fats: 14 }
                    ]
                }[mealTime];
            } else {
                return {
                    breakfast: [
                        { name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 55, fats: 8 },
                        { name: '3 Boiled Egg Whites & 1 Toast', calories: 280, protein: 20, carbs: 15, fats: 5 },
                        { name: 'Egg White Omelette with Spinach', calories: 250, protein: 22, carbs: 5, fats: 8 }
                    ],
                    lunch: [
                        { name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 15, fats: 20 },
                        { name: 'Chicken Tikka with 1 Roti', calories: 400, protein: 35, carbs: 20, fats: 15 },
                        { name: 'Baked Fish with Quinoa', calories: 420, protein: 35, carbs: 35, fats: 12 }
                    ],
                    dinner: [
                        { name: 'Baked Salmon with Asparagus', calories: 400, protein: 35, carbs: 10, fats: 22 },
                        { name: 'Grilled Turkey Breast & Broccoli', calories: 350, protein: 40, carbs: 10, fats: 10 },
                        { name: 'Clear Chicken Soup', calories: 280, protein: 25, carbs: 15, fats: 8 }
                    ],
                    snacks: [
                        { name: 'Protein Shake', calories: 150, protein: 25, carbs: 5, fats: 2 },
                        { name: 'Hard Boiled Egg', calories: 70, protein: 6, carbs: 0, fats: 5 },
                        { name: 'Cottage Cheese', calories: 120, protein: 14, carbs: 4, fats: 5 }
                    ]
                }[mealTime];
            }
        } else if (goal === 'Gain Muscle') {
            if (isVeg) {
                return {
                    breakfast: [
                        { name: 'Soya Chunk Stir-fry & Avocado Toast', calories: 500, protein: 30, carbs: 45, fats: 20 },
                        { name: 'High Protein Oat Bowl (Milk, Nuts, Seeds)', calories: 550, protein: 25, carbs: 65, fats: 22 },
                        { name: 'Paneer Paratha with Curd', calories: 600, protein: 25, carbs: 55, fats: 25 }
                    ],
                    lunch: [
                        { name: 'Paneer Tikka with Brown Rice/Dal', calories: 650, protein: 35, carbs: 70, fats: 25 },
                        { name: 'Rajma Chawal with Salad', calories: 600, protein: 25, carbs: 80, fats: 15 },
                        { name: 'Chickpea & Tofu Bowl', calories: 620, protein: 35, carbs: 65, fats: 20 }
                    ],
                    dinner: [
                        { name: 'Chickpea Curry with 2 Rotis', calories: 600, protein: 25, carbs: 80, fats: 15 },
                        { name: 'Tofu Bhurji with Quinoa', calories: 550, protein: 30, carbs: 50, fats: 18 },
                        { name: 'Soya & Pea Pulao with Raita', calories: 580, protein: 25, carbs: 75, fats: 15 }
                    ],
                    snacks: [
                        { name: 'Protein Shake and Banana', calories: 300, protein: 30, carbs: 40, fats: 5 },
                        { name: 'Roasted Peanuts & Jaggery', calories: 250, protein: 10, carbs: 25, fats: 15 },
                        { name: 'Sprouts Salad', calories: 200, protein: 12, carbs: 30, fats: 3 }
                    ]
                }[mealTime];
            } else {
                return {
                    breakfast: [
                        { name: 'Scrambled Eggs & Avocado Toast', calories: 550, protein: 25, carbs: 45, fats: 30 },
                        { name: 'Whole Wheat Pancakes with Honey & Eggs', calories: 600, protein: 28, carbs: 75, fats: 18 },
                        { name: 'Oatmeal & 3 Whole Boiled Eggs', calories: 500, protein: 25, carbs: 50, fats: 20 }
                    ],
                    lunch: [
                        { name: 'Chicken, Rice and Broccoli', calories: 700, protein: 45, carbs: 80, fats: 15 },
                        { name: 'Beef Stir Fry with Noodles', calories: 650, protein: 40, carbs: 70, fats: 20 },
                        { name: 'Chicken Curry with 3 Rotis', calories: 680, protein: 40, carbs: 65, fats: 22 }
                    ],
                    dinner: [
                        { name: 'Grilled Salmon with Sweet Potato', calories: 650, protein: 40, carbs: 50, fats: 25 },
                        { name: 'Beef Mince & Pasta', calories: 700, protein: 45, carbs: 75, fats: 20 },
                        { name: 'Chicken Breast with Mashed Potatoes', calories: 600, protein: 50, carbs: 45, fats: 15 }
                    ],
                    snacks: [
                        { name: 'Protein Shake and Banana', calories: 300, protein: 30, carbs: 40, fats: 5 },
                        { name: 'Greek Yogurt with Almonds', calories: 280, protein: 20, carbs: 15, fats: 15 },
                        { name: 'Chicken Sandwich', calories: 350, protein: 25, carbs: 35, fats: 10 }
                    ]
                }[mealTime];
            }
        } else {
            // Maintain Health
            return {
                breakfast: [
                    { name: 'Fruit Smoothie Bowl', calories: 400, protein: 10, carbs: 70, fats: 10 },
                    { name: isVeg ? 'Poha with Peanuts' : '2 Eggs and Toast', calories: 350, protein: 15, carbs: 45, fats: 12 },
                    { name: 'Oatmeal with Apple', calories: 320, protein: 10, carbs: 55, fats: 6 }
                ],
                lunch: [
                    { name: isVeg ? 'Moong Dal Khichdi with Veggies' : 'Quinoa Bowl with Roasted Veggies', calories: 450, protein: 18, carbs: 65, fats: 10 },
                    { name: isVeg ? 'Roti, Dal, and Mixed Sabzi' : 'Chicken Salad Wrap', calories: 500, protein: 22, carbs: 55, fats: 15 },
                    { name: 'Brown Rice with Chana Masala', calories: 480, protein: 18, carbs: 70, fats: 12 }
                ],
                dinner: [
                    { name: 'Lentil Soup with Whole Grain Bread', calories: 450, protein: 22, carbs: 60, fats: 12 },
                    { name: isVeg ? 'Vegetable Pulao' : 'Lemon Herb Chicken & Veggies', calories: 400, protein: 25, carbs: 45, fats: 12 },
                    { name: 'Stir Fried Tofu/Chicken with Asian Greens', calories: 380, protein: 20, carbs: 30, fats: 15 }
                ],
                snacks: [
                    { name: 'Almonds and Apple', calories: 200, protein: 6, carbs: 20, fats: 14 },
                    { name: 'Hummus with Carrots', calories: 180, protein: 5, carbs: 15, fats: 12 },
                    { name: 'Roasted Makhana', calories: 150, protein: 4, carbs: 25, fats: 4 }
                ]
            }[mealTime];
        }
    };

    const formatMeal = (mealTime) => {
        const options = getOptions(mealTime);
        const shuffled = [...options].sort(() => 0.5 - Math.random());
        return {
            selected: shuffled[0],
            alternatives: shuffled.slice(1)
        };
    };

    const bf = formatMeal('breakfast');
    const lun = formatMeal('lunch');
    const din = formatMeal('dinner');
    const snk = formatMeal('snacks');
    
    const focusLabel = goal === 'Lose Fat' ? 'Calorie Deficit & High Protein' :
                       goal === 'Gain Muscle' ? 'Calorie Surplus & High Protein/Carbs' : 'Balanced Nutrition & Maintenance';
                       
    const totalCalories = bf.selected.calories + lun.selected.calories + din.selected.calories + snk.selected.calories;
    const totalProtein = bf.selected.protein + lun.selected.protein + din.selected.protein + snk.selected.protein;
    const totalCarbs = bf.selected.carbs + lun.selected.carbs + din.selected.carbs + snk.selected.carbs;
    const totalFats = bf.selected.fats + lun.selected.fats + din.selected.fats + snk.selected.fats;

    return {
        breakfast: bf,
        lunch: lun,
        dinner: din,
        snacks: snk,
        focus: focusLabel,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats
    };
};
