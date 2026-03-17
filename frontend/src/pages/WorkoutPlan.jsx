import { useState, useEffect } from 'react';
import workoutService from '../services/workoutService';
import { Dumbbell, Timer, Flame, ChevronRight, PlayCircle } from 'lucide-react';

const WorkoutPlan = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await workoutService.getWorkoutPlan();
        setWorkouts(data.exercises);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch workout plan. Please complete your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl">Creating your training regime...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-end animate-premium">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">Daily Training</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Tailored exercises based on your fitness goals</p>
        </div>
        <div className="hidden md:flex gap-4">
            <div className="premium-card px-4 py-2 glass dark:glass-dark animate-premium">
                <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Est. Time</p>
                <p className="font-bold text-lg">~45m</p>
            </div>
            <div className="premium-card px-4 py-2 glass dark:glass-dark animate-premium" style={{ animationDelay: '100ms' }}>
                <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Difficulty</p>
                <p className="font-bold text-lg">Med</p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        {workouts.map((exo, idx) => (
          <div key={idx} className="group premium-card glass p-5 animate-premium flex items-center justify-between" style={{ animationDelay: `${(idx + 2) * 100}ms` }}>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Dumbbell size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{exo.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><Timer size={14} /> {exo.duration}</span>
                  <span className="flex items-center gap-1"><Flame size={14} /> {exo.sets} Sets x {exo.reps}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                 exo.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' : 
                 exo.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 
                 'bg-green-500/10 text-green-500'
               }`}>
                 {exo.difficulty}
               </span>
               <button className="p-2 hover:bg-[var(--muted)] rounded-full transition">
                  <PlayCircle size={28} className="text-[var(--primary)]" />
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-br from-[var(--primary)] to-emerald-700 rounded-[var(--radius)] text-white shadow-2xl relative overflow-hidden group animate-premium" style={{ animationDelay: '600ms' }}>
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={160} />
         </div>
         <h3 className="text-2xl font-bold mb-2 relative z-10">Ready to start?</h3>
         <p className="text-green-50 opacity-90 mb-8 max-w-md relative z-10">Track your workout completion in the dashboard to maintain your streak and earn consistency points.</p>
         <button className="bg-white text-[var(--primary)] px-10 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all flex items-center gap-2 group relative z-10 hover:shadow-xl active:scale-95">
            Start Workout <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default WorkoutPlan;
