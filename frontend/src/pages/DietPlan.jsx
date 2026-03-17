import { useState, useEffect } from 'react';
import dietService from '../services/dietService';
import { Utensils, Coffee, Sun, Moon, Info } from 'lucide-react';

const DietPlan = () => {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const data = await dietService.getDietPlan();
        setDiet(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch diet plan. Please complete your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchDiet();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl">Loading your meal plan...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const MealCard = ({ title, meal, icon: Icon, time, delay }) => (
    <div className="premium-card glass p-6 animate-premium" style={{ animationDelay: delay }}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-lg">
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{time}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">{title}</h3>
      <p className="text-[var(--muted-foreground)] font-medium mb-4">{meal.name}</p>
      
      <div className="grid grid-cols-4 gap-2 border-t border-[var(--border)] pt-4">
        <div className="text-center">
          <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Cal</p>
          <p className="font-bold text-sm">{meal.calories}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Pro</p>
          <p className="font-bold text-sm">{meal.protein}g</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Carb</p>
          <p className="font-bold text-sm">{meal.carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Fat</p>
          <p className="font-bold text-sm">{meal.fats}g</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-premium">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">Your Weekly Meal Plan</h1>
          <p className="text-[var(--muted-foreground)] mt-2 flex items-center gap-1 italic">
             <Info size={16} /> Strategy: {diet.focus}
          </p>
        </div>
        <div className="bg-green-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-green-500/30">
          V1.0 Generation
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MealCard title="Breakfast" meal={diet.breakfast} icon={Coffee} time="08:00 AM" delay="0ms" />
        <MealCard title="Lunch" meal={diet.lunch} icon={Sun} time="01:30 PM" delay="100ms" />
        <MealCard title="Snacks" meal={diet.snacks} icon={Utensils} time="04:30 PM" delay="200ms" />
        <MealCard title="Dinner" meal={diet.dinner} icon={Moon} time="08:30 PM" delay="300ms" />
      </div>

      <div className="premium-card p-6 glass flex items-start gap-4 animate-premium" style={{ animationDelay: '400ms' }}>
         <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
            <Info size={24} />
         </div>
         <div>
            <h4 className="font-bold text-[var(--foreground)]">Nutritionist Tip</h4>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">
               Always prioritize whole foods over processed ones. If you feel extra hungry, increase your water intake or add more leafy greens to your lunch and dinner.
            </p>
         </div>
      </div>
    </div>
  );
};

export default DietPlan;
