import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import { Ruler, Weight, Activity, Target, Save, User, Zap, Droplets, Star } from 'lucide-react';

const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'];
const fitnessGoals = ['Lose Fat', 'Maintain Health', 'Gain Muscle'];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (h < 18) return { text: 'Good Afternoon', emoji: '☀️' };
  return { text: 'Good Evening', emoji: '🌙' };
};

const InputField = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full p-3 rounded-xl border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition";

const Profile = () => {
  const { user } = useAuth();
  const greeting = getGreeting();

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
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    profileService.getMetrics().then(data => {
      if (!data.incomplete) setMetrics(data);
    }).catch(() => {});
  }, []);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await profileService.updateProfile(formData);
      localStorage.setItem('user', JSON.stringify(updated));
      setMetrics({ bmi: updated.bmi, category: updated.category, dailyCalories: updated.dailyCalories });
      setMessage({ text: '✅ Profile saved successfully!', type: 'success' });
    } catch {
      setMessage({ text: '❌ Failed to update profile. Try again.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const bmiColor = () => {
    if (!metrics?.bmi) return 'text-[var(--primary)]';
    const b = parseFloat(metrics.bmi);
    if (b < 18.5) return 'text-blue-400';
    if (b < 25) return 'text-green-500';
    if (b < 30) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Greeting Header */}
      <div className="animate-premium">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{greeting.emoji}</span>
          <span className="text-sm font-bold text-[var(--primary)] uppercase tracking-widest">{greeting.text}, {user?.name?.split(' ')[0] || 'User'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight">Your Profile</h1>
        <p className="text-[var(--muted-foreground)] mt-1 text-sm md:text-base">Configure your physiological parameters for AI optimization</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 premium-card glass p-6 md:p-8 animate-premium">
          {/* Avatar strip */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-[var(--muted)] rounded-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
              <User size={28} />
            </div>
            <div>
              <p className="font-black text-[var(--foreground)] text-lg">{user?.name || 'Your Name'}</p>
              <p className="text-[var(--muted-foreground)] text-sm">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" icon={Star}>
                <input type="number" required className={inputCls} value={formData.age}
                  onChange={e => set('age', e.target.value)} placeholder="e.g. 25" />
              </InputField>
              <InputField label="Gender">
                <select className={inputCls} value={formData.gender} onChange={e => set('gender', e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </InputField>
            </div>

            {/* Height + Weight */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Height (cm)" icon={Ruler}>
                <input type="number" required className={inputCls} value={formData.height}
                  onChange={e => set('height', e.target.value)} placeholder="e.g. 170" />
              </InputField>
              <InputField label="Weight (kg)" icon={Weight}>
                <input type="number" required className={inputCls} value={formData.weight}
                  onChange={e => set('weight', e.target.value)} placeholder="e.g. 70" />
              </InputField>
            </div>

            {/* Activity Level */}
            <InputField label="Activity Level" icon={Activity}>
              <select className={inputCls} value={formData.activityLevel} onChange={e => set('activityLevel', e.target.value)}>
                {activityLevels.map(l => <option key={l}>{l}</option>)}
              </select>
            </InputField>

            {/* Fitness Goal + Target Weight */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Fitness Goal" icon={Target}>
                <select className={inputCls} value={formData.fitnessGoal} onChange={e => set('fitnessGoal', e.target.value)}>
                  {fitnessGoals.map(g => <option key={g}>{g}</option>)}
                </select>
              </InputField>
              <InputField label="Target Weight (kg)">
                <input type="number" className={inputCls} value={formData.targetWeight}
                  onChange={e => set('targetWeight', e.target.value)} placeholder="e.g. 65" />
              </InputField>
            </div>

            {/* Diet Preference */}
            <InputField label="Diet Preference" icon={Droplets}>
              <div className="grid grid-cols-2 gap-3">
                {['Vegetarian', 'Non-Vegetarian'].map(opt => (
                  <button key={opt} type="button"
                    onClick={() => set('dietPreference', opt)}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all ${formData.dietPreference === opt
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50'
                    }`}>
                    {opt === 'Vegetarian' ? '🥗 Vegetarian' : '🍗 Non-Vegetarian'}
                  </button>
                ))}
              </div>
            </InputField>

            {/* Save button */}
            <button type="submit" disabled={loading}
              className="btn-premium w-full py-4 text-base font-black flex items-center justify-center gap-2 shadow-xl">
              {loading
                ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Syncing…</>
                : <><Save size={18} /> Save Profile</>
              }
            </button>

            {message.text && (
              <p className={`text-center text-sm font-semibold ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
              </p>
            )}
          </form>
        </div>

        {/* Metrics Sidebar */}
        <div className="space-y-5">
          {/* BMI Card */}
          <div className="premium-card glass p-6 animate-premium" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-black text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Zap size={18} className="text-[var(--primary)]" /> Health Metrics
            </h2>
            {metrics ? (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--muted)] rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Body Mass Index</p>
                  <p className={`text-4xl font-black mt-1 ${bmiColor()}`}>{metrics.bmi}</p>
                  <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${bmiColor()} bg-current/10`}>
                    {metrics.category}
                  </span>
                </div>
                <div className="p-4 bg-[var(--muted)] rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Daily Calorie Target</p>
                  <p className="text-4xl font-black text-[var(--primary)] mt-1">{metrics.dailyCalories} <span className="text-lg font-bold">kcal</span></p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-[var(--muted)] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Zap size={24} className="text-[var(--muted-foreground)]" />
                </div>
                <p className="text-[var(--muted-foreground)] text-sm">Fill in your details and save to unlock your health metrics.</p>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="premium-card glass p-6 animate-premium" style={{ animationDelay: '200ms' }}>
            <h3 className="font-black text-[var(--foreground)] mb-4">💡 Tips for Success</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              {['Drink at least 2L of water daily', 'Aim for 7–8 hours of sleep', 'Consistency beats intensity', 'Track your meals for accountability'].map(tip => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-[var(--primary)] font-bold mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
