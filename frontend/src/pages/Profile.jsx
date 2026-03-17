import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import { User as UserIcon, Ruler, Weight, Activity, Target, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: user?.age || '',
    gender: user?.gender || 'Male',
    height: user?.height || '',
    weight: user?.weight || '',
    activityLevel: user?.activityLevel || 'Moderately Active',
    fitnessGoal: user?.fitnessGoal || 'Maintain Health',
    targetWeight: user?.targetWeight || '',
    dietPreference: user?.dietPreference || 'Non-Vegetarian',
  });

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await profileService.getMetrics();
      if (!data.incomplete) {
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch metrics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(formData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMetrics({
        bmi: updatedUser.bmi,
        category: updatedUser.category,
        dailyCalories: updatedUser.dailyCalories
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'];
  const fitnessGoals = ['Lose Fat', 'Maintain Health', 'Gain Muscle'];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-10">
      <div className="animate-premium">
        <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Biological Identity</h1>
        <p className="text-[var(--muted-foreground)] mt-2 font-medium">Configure your physiological parameters for AI optimization</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-8 glass dark:glass-dark animate-premium">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Ruler size={14} /> Height (cm)
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Weight size={14} /> Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Activity size={14} /> Activity Level
              </label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              >
                {activityLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Target size={14} /> Fitness Goal
                </label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                >
                  {fitnessGoals.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Weight (kg)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Diet Preference</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={formData.dietPreference}
                onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
              >
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegetarian">Vegetarian</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-4 text-lg shadow-xl shadow-[var(--primary)]/20"
            >
              {loading ? 'SYNCING...' : <><Save size={20} /> PERSIST ENTITY DATA</>}
            </button>
            {message && <p className={`text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="premium-card p-8 glass dark:glass-dark animate-premium" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-black mb-6 text-[var(--foreground)]">Atmospheric Metrics</h2>
            {metrics ? (
              <div className="space-y-6">
                <div className="p-4 glass rounded-2xl border border-[var(--border)]">
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Body Mass Index</p>
                  <p className="text-4xl font-serif font-bold text-[var(--primary)] mt-1">{metrics.bmi}</p>
                  <p className="inline-block px-3 py-1 mt-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs uppercase font-black tracking-widest">
                    {metrics.category}
                  </p>
                </div>
                <div className="p-4 glass rounded-2xl border border-[var(--border)]">
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Metabolic Intake Target</p>
                  <p className="text-4xl font-serif font-bold text-[var(--primary)] mt-1">{metrics.dailyCalories} <span className="text-xl">kcal</span></p>
                </div>
              </div>
            ) : (
              <p className="text-[var(--muted-foreground)] italic font-medium">Complete your biological profile to unlock neural metrics.</p>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold mb-2">Tips for Success</h3>
             <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Drink at least 2L of water daily</li>
                <li>• Aim for 7-8 hours of sleep</li>
                <li>• Consistency is key to progress</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
