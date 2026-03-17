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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <UserIcon className="text-green-600" /> My Health Profile
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 flex items-center justify-center gap-2 transition"
            >
              {loading ? 'Saving...' : <><Save size={18} /> Save Profile</>}
            </button>
            {message && <p className={`text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/50">
            <h2 className="text-xl font-bold mb-4">Current Status</h2>
            {metrics ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">BMI</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{metrics.bmi}</p>
                  <p className="inline-block px-2 py-0.5 mt-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs uppercase font-bold tracking-wider">
                    {metrics.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recommended Daily Intake</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{metrics.dailyCalories} kcal</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Complete your profile to see your health metrics.</p>
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
