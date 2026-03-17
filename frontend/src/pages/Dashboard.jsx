import { useState, useEffect } from 'react';
import progressService from '../services/progressService';
import { 
  Trophy, 
  Flame, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Plus, 
  Activity, 
  Droplet, 
  Target
} from 'lucide-react';

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It never gets easier, you just get stronger.",
  "You don't have to be extreme, just consistent."
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    caloriesConsumed: '',
    waterIntake: '',
    workoutCompleted: false
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchStats = async () => {
    try {
      const data = await progressService.getStats();
      setStats(data);
      if (data.currentWeight) {
          setFormData(prev => ({ ...prev, weight: data.currentWeight }));
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await progressService.createLog(formData);
      setShowLogForm(false);
      fetchStats();
    } catch (err) {
      alert('Error logging progress');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Analyzing your progress...</div>;

  const StatCard = ({ title, value, subValue, icon: Icon, color, delay }) => (
    <div 
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300 animate-in fade-in slide-in-from-bottom flex flex-col justify-between`}
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
          {subValue && <p className="text-xs text-gray-400 mt-2 font-medium">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Fitness Dashboard</h1>
          <p className="text-gray-500 mt-1">{getGreeting()}! Here's your health summary.</p>
        </div>
        <button 
          onClick={() => setShowLogForm(!showLogForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-green-600/20"
        >
          <Plus size={20} /> Log Daily Progress
        </button>
      </div>

      {showLogForm && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-green-200 dark:border-green-900/30 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-green-600" /> Log Today's Metrics
          </h2>
          <form onSubmit={handleLogSubmit} className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Calories Consumed</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                value={formData.caloriesConsumed}
                onChange={(e) => setFormData({...formData, caloriesConsumed: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Water (Liters)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                value={formData.waterIntake}
                onChange={(e) => setFormData({...formData, waterIntake: e.target.value})}
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer select-none mb-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-green-600"
                  checked={formData.workoutCompleted}
                  onChange={(e) => setFormData({...formData, workoutCompleted: e.target.checked})}
                />
                <span className="text-sm font-medium">Workout Completed Today</span>
              </label>
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                Save Daily Log
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Weight" 
          value={`${stats?.currentWeight || '--'} kg`} 
          subValue={`Target: ${stats?.targetWeight || '--'} kg`}
          icon={Activity} 
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          delay="0ms"
        />
        <StatCard 
          title="Workout Streak" 
          value={`${stats?.streak || 0} Days`} 
          subValue="Keep the fire burning!"
          icon={Flame} 
          color="bg-orange-100 dark:bg-orange-900/30 text-orange-600"
          delay="100ms"
        />
        <StatCard 
          title="Goal Progress" 
          value={`${stats?.progressPercentage || 0}%`} 
          subValue="You're getting closer"
          icon={Trophy} 
          color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
          delay="200ms"
        />
        <StatCard 
          title="Health Score" 
          value="82/100" 
          subValue="Excellent Consistency"
          icon={Target} 
          color="bg-green-100 dark:bg-green-900/30 text-green-600"
          delay="300ms"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-xl font-bold mb-6">Weight Progression</h3>
           <div className="h-64 flex items-end justify-between gap-2">
             {stats?.history?.slice(-10).map((log, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="w-full bg-green-100 dark:bg-green-900/40 rounded-t-lg group-hover:bg-green-500 transition-colors" style={{ height: `${(log.weight / stats.startWeight) * 100}%` }}></div>
                   <span className="text-[10px] text-gray-400 uppercase font-bold">{new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                </div>
             ))}
             {!stats?.history?.length && <p className="w-full text-center text-gray-400 italic">No historical data yet. Start logging!</p>}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={120} />
              </div>
              <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                <Flame className="text-orange-400 animate-pulse" /> Daily Motivation
              </h3>
              <p className="opacity-90 italic min-h-[3rem] relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                "{motivationalQuotes[quoteIndex]}"
              </p>
              <div className="mt-6 flex items-center justify-between relative z-10">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Next Milestone</p>
                <div className="h-2 w-24 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-[65%] animate-pulse"></div>
                </div>
              </div>
           </div>

           <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Droplet className="text-blue-500" /> Daily Reminders</h3>
              <ul className="space-y-4">
                 <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Water Intake Goal</span>
                    <span className="font-bold">2.5L / 3L</span>
                 </li>
                 <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Calorie Cap</span>
                    <span className="font-bold text-red-500">2100 / 1800</span>
                 </li>
                 <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sleep Goal</span>
                    <span className="font-bold text-green-500">8h / 8h</span>
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
