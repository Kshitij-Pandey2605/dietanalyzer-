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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Daily Training</h1>
          <p className="text-gray-500 mt-2">Tailored exercises based on your fitness goals</p>
        </div>
        <div className="hidden md:flex gap-4">
            <div className="text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Est. Time</p>
                <p className="font-bold text-lg">~45m</p>
            </div>
            <div className="text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Difficulty</p>
                <p className="font-bold text-lg">Med</p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        {workouts.map((exo, idx) => (
          <div key={idx} className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <Dumbbell size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{exo.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Timer size={14} /> {exo.duration}</span>
                  <span className="flex items-center gap-1"><Flame size={14} /> {exo.sets} Sets x {exo.reps}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                 exo.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 
                 exo.difficulty === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                 'bg-green-100 text-green-600'
               }`}>
                 {exo.difficulty}
               </span>
               <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition">
                  <PlayCircle size={28} className="text-green-600" />
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl text-white shadow-xl shadow-green-500/20">
         <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
         <p className="text-green-50 opacity-90 mb-6 max-w-md">Track your workout completion in the dashboard to maintain your streak and earn consistency points.</p>
         <button className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center gap-2 group">
            Start Workout <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default WorkoutPlan;
