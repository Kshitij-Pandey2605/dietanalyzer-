import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Sun, Moon, User, Lock, Palette, Bell, Save, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const nameRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    weeklyReport: true,
  });

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <SettingsIcon className="text-green-600" /> Settings
      </h1>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2"><User size={20} className="text-green-600" /> Account</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              ref={nameRef}
              type="text"
              className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2"><Palette size={20} className="text-green-600" /> Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${darkMode ? 'bg-green-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${darkMode ? 'translate-x-7' : 'translate-x-1'}`}>
                {darkMode ? <Moon size={14} className="text-green-600" /> : <Sun size={14} className="text-orange-400" />}
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2"><Bell size={20} className="text-green-600" /> Notifications</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive reminders for workouts and meals</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 accent-green-600"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Weekly Progress Report</p>
              <p className="text-sm text-gray-500">Receive weekly summary of your progress</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 accent-green-600"
              checked={settings.weeklyReport}
              onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
            />
          </label>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2"><Lock size={20} className="text-green-600" /> Security</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
        >
          {saved ? <><CheckCircle size={20} /> Saved!</> : <><Save size={20} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default Settings;
