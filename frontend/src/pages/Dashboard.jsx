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
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It never gets easier, you just get stronger.",
  "You don't have to be extreme, just consistent."
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [todayWorkoutDone, setTodayWorkoutDone] = useState(null); // null = unknown
  const [formData, setFormData] = useState({
    weight: '',
    caloriesConsumed: '',
    waterIntake: '',
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
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  const fetchStats = async () => {
    try {
      const data = await progressService.getStats();
      setStats(data);
      if (data.currentWeight) {
          setFormData(prev => ({ ...prev, weight: data.currentWeight }));
      }
      // Detect if today's workout was already logged as done
      if (data.history && data.history.length > 0) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const todayLog = data.history.find(log => {
          const d = new Date(log.date); d.setHours(0,0,0,0);
          return d.getTime() === today.getTime();
        });
        if (todayLog) setTodayWorkoutDone(todayLog.workoutCompleted);
        else setTodayWorkoutDone(null);
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

  const StatCard = ({ title, value, subValue, icon: Icon, gradient, delay }) => (
    <div 
      className={`premium-card glass p-6 flex flex-col justify-between animate-premium group`}
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-[var(--foreground)]">{value}</h3>
          {subValue && <p className="text-xs text-[var(--muted-foreground)] mt-2 font-medium">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="animate-premium">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{getGreeting().emoji}</span>
            <span className="text-sm font-bold text-[var(--primary)] uppercase tracking-widest">{getGreeting().text}, {user?.name || 'User'}</span>
            {todayWorkoutDone === true && <span className="text-sm font-bold text-green-500 hidden sm:inline">— Well Done 🔥</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)]">Fitness Dashboard</h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm md:text-base">Your personalized health evolution summary.</p>
        </div>
        <button 
          onClick={() => setShowLogForm(!showLogForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-green-600/20"
        >
          <Plus size={20} /> Log Daily Progress
        </button>
      </div>


      {showLogForm && (
        <div className="premium-card p-6 md:p-8 glass animate-premium">
          {/* Keep Going banner — only if workout not done today */}
          {todayWorkoutDone !== true && (
            <div className="mb-6 flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white">
              <Flame size={28} className="text-yellow-300 shrink-0" />
              <div>
                <p className="font-black">Keep Going! 💪</p>
                <p className="text-orange-100 text-sm">Head to Training page to complete today's workout!</p>
              </div>
            </div>
          )}
          <h2 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2 text-[var(--foreground)]">
            <Clock className="text-[var(--primary)]" /> {getGreeting().text}, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <form onSubmit={handleLogSubmit} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Weight (kg)</label>
              <input 
                type="number" step="0.1" required
                className="w-full p-3 border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-700 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Calories Consumed</label>
              <input 
                type="number"
                className="w-full p-3 border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-700 dark:text-white rounded-xl"
                value={formData.caloriesConsumed}
                onChange={(e) => setFormData({...formData, caloriesConsumed: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Water (Liters)</label>
              <input 
                type="number" step="0.1"
                className="w-full p-3 border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-700 dark:text-white rounded-xl"
                value={formData.waterIntake}
                onChange={(e) => setFormData({...formData, waterIntake: e.target.value})}
              />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <button type="submit" className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition">
                Save Daily Log
              </button>
              <p className="text-xs text-[var(--muted-foreground)] mt-2 text-center">Workout status is tracked automatically from the Training page 🏋️</p>
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
          gradient="from-blue-500 to-indigo-600"
          delay="0ms"
        />
        <StatCard 
          title="Workout Streak" 
          value={`${stats?.streak || 0} Days`} 
          subValue={todayWorkoutDone === true ? '🔥 Keep the fire burning!' : todayWorkoutDone === false ? '⚡ Complete today to grow!' : 'Log your workout!'}
          icon={Flame} 
          gradient="from-orange-500 to-red-600"
          delay="100ms"
        />
        <StatCard 
          title="Goal Progress" 
          value={`${stats?.progressPercentage || 0}%`} 
          subValue="You're getting closer"
          icon={Trophy} 
          gradient="from-yellow-400 to-orange-500"
          delay="200ms"
        />
        <StatCard 
          title="Health Score" 
          value="82/100" 
          subValue="Excellent Consistency"
          icon={Target} 
          gradient="from-green-500 to-emerald-600"
          delay="300ms"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card glass p-8 animate-premium">
           <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">Weight Progression</h3>
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
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Flame size={120} />
              </div>
              <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                <Flame className="text-orange-400 animate-pulse" /> Next Milestone
              </h3>
              <div className="mt-2 relative z-10">
                <p className="text-sm opacity-80 mb-2">{todayWorkoutDone ? 'Streak maintained! Keep going 🔥' : 'Complete today\'s workout to grow streak'}</p>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-700" style={{ width: `${Math.min(100, (stats?.streak || 0) * 10)}%` }}></div>
                </div>
                <p className="text-xs mt-1 opacity-70">{stats?.streak || 0} day streak</p>
              </div>
           </div>

           <div className="premium-card p-6 glass dark:glass-dark">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--foreground)]"><Droplet className="text-blue-500" /> Daily Reminders</h3>
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
