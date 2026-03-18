import { useState, useEffect } from 'react';
import dietService from '../services/dietService';
import { Utensils, Coffee, Sun, Moon, Info, RefreshCw } from 'lucide-react';

const DietPlan = () => {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regeneratingMeal, setRegeneratingMeal] = useState(null);

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

  const handleRegenerate = async (mealType) => {
    setRegeneratingMeal(mealType);
    try {
      const newDiet = await dietService.regenerateMeal(mealType);
      setDiet(newDiet);
    } catch (err) {
      alert(err.response?.data?.message || 'Error regenerating meal');
    } finally {
      setRegeneratingMeal(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading your meal plan...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const MealCard = ({ title, type, mealData, icon: Icon, time, delay }) => {
    if (!mealData || !mealData.selected) return null;
    const meal = mealData.selected;

    return (
      <div className="premium-card glass p-6 animate-premium relative group hover:-translate-y-1 transition-transform" style={{ animationDelay: delay }}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon size={24} />
          </div>
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{time}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
            <button 
                onClick={() => handleRegenerate(type)}
                disabled={regeneratingMeal === type}
                className={`p-1.5 rounded-lg transition-colors ${
                  regeneratingMeal === type 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800' 
                    : 'bg-green-100 text-[var(--primary)] hover:bg-green-200 dark:bg-green-900/30'
                }`}
                title="Regenerate Meal"
            >
                <RefreshCw size={16} className={regeneratingMeal === type ? "animate-spin" : ""} />
            </button>
        </div>
        
        <p className="text-[var(--muted-foreground)] font-medium mb-4 h-12 overflow-hidden">{meal.name}</p>
        
        <div className="grid grid-cols-4 gap-2 border-t border-[var(--border)] pt-4">
          <div className="text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Cal</p>
            <p className="font-bold text-sm text-[var(--primary)]">{meal.calories}</p>
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

        {mealData.alternatives && mealData.alternatives.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[var(--border)]">
                <p className="text-[10px] font-bold text-[var(--muted-foreground)] mb-2 uppercase tracking-wide">Alternatives</p>
                <div className="flex flex-col gap-1 text-xs">
                    {mealData.alternatives.map((alt, idx) => (
                        <span key={idx} className="bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-1.5 rounded-md truncate">
                           {alt.name}
                        </span>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-premium">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight">Today's Diet</h1>
          <p className="text-[var(--muted-foreground)] mt-2 flex items-center gap-2 italic">
             <Info size={16} className="text-green-500" /> Strategy: {diet.focus}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-green-500/30 flex items-center gap-3">
             <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Daily Target</span>
             <span className="text-2xl">{diet.totalCalories}</span>
             <span className="text-sm font-medium opacity-80">kcal</span>
          </div>
          <span className="text-xs text-[var(--muted-foreground)] mt-2 font-medium">Daily Tracking Enabled</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <MealCard title="Breakfast" type="breakfast" mealData={diet.breakfast} icon={Coffee} time="08:00 AM" delay="0ms" />
        <MealCard title="Lunch" type="lunch" mealData={diet.lunch} icon={Sun} time="01:30 PM" delay="100ms" />
        <MealCard title="Snacks" type="snacks" mealData={diet.snacks} icon={Utensils} time="04:30 PM" delay="200ms" />
        <MealCard title="Dinner" type="dinner" mealData={diet.dinner} icon={Moon} time="08:30 PM" delay="300ms" />
      </div>

      <div className="premium-card p-6 glass flex items-start gap-4 animate-premium" style={{ animationDelay: '400ms' }}>
         <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shrink-0">
            <Info size={24} />
         </div>
         <div>
            <h4 className="font-bold text-[var(--foreground)]">Nutritionist Tip</h4>
            <p className="text-[var(--muted-foreground)] text-sm mt-1 leading-relaxed">
               Always prioritize whole foods over processed ones. If you don't like your current meal, use the <strong className="text-green-600 dark:text-green-400">Regenerate</strong> button on the meal card to swap it with an alternative instantly.
            </p>
         </div>
      </div>
    </div>
  );
};

export default DietPlan;
