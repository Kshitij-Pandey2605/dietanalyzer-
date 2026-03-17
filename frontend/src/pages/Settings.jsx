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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-10">
      <div className="animate-premium">
        <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">System Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-2 font-medium">Configure your biological optimization environment</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="premium-card p-8 glass space-y-6 animate-premium" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-black flex items-center gap-3"><User size={24} className="text-[var(--primary)]" /> Identity</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Legal Cipher (Name)</label>
              <input
                ref={nameRef}
                type="text"
                className="w-full p-4 glass dark:glass-dark border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Electronic Node (Email)</label>
              <input
                type="email"
                className="w-full p-4 glass dark:glass-dark border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="premium-card p-8 glass space-y-8 animate-premium" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-black flex items-center gap-3"><Palette size={24} className="text-[var(--primary)]" /> Visual Matrix</h2>
          <div className="flex items-center justify-between p-4 glass rounded-2xl border border-[var(--border)]">
            <div>
              <p className="font-black text-lg">Luminance Mode</p>
              <p className="text-sm text-[var(--muted-foreground)] font-medium">Toggle between photonic states</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative w-16 h-10 rounded-full transition-all duration-500 shadow-xl ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-orange-400 to-yellow-500'}`}
            >
              <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-2xl transition-all duration-500 flex items-center justify-center ${darkMode ? 'translate-x-[1.75rem]' : 'translate-x-1'}`}>
                {darkMode ? <Moon size={18} className="text-indigo-600" /> : <Sun size={18} className="text-orange-500" />}
              </div>
            </button>
          </div>
        </div>

        <div className="premium-card p-8 glass space-y-6 animate-premium" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-black flex items-center gap-3"><Bell size={24} className="text-[var(--primary)]" /> Neural Sync</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-[var(--primary)]/5 rounded-2xl transition-colors">
              <div>
                <p className="font-bold">Real-time Reminders</p>
                <p className="text-sm text-[var(--muted-foreground)]">Protocol alerts for intake and training</p>
              </div>
              <input
                type="checkbox"
                className="w-6 h-6 accent-[var(--primary)]"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-[var(--primary)]/5 rounded-2xl transition-colors">
              <div>
                <p className="font-bold">Weekly Performance Intel</p>
                <p className="text-sm text-[var(--muted-foreground)]">Aggregated metabolic trend reporting</p>
              </div>
              <input
                type="checkbox"
                className="w-6 h-6 accent-[var(--primary)]"
                checked={settings.weeklyReport}
                onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="premium-card p-8 glass space-y-6 animate-premium" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-black flex items-center gap-3"><Lock size={24} className="text-[var(--primary)]" /> Defensive Protocols</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Current Cipher</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 glass dark:glass-dark border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-2">New Cipher</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 glass dark:glass-dark border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-premium w-full py-5 text-xl shadow-2xl shadow-[var(--primary)]/20 animate-premium"
          style={{ animationDelay: '500ms' }}
        >
          {saved ? <span className="flex items-center justify-center gap-2"><CheckCircle size={24} /> DATA PERSISTED</span> : <span className="flex items-center justify-center gap-2"><Save size={24} /> COMMIT CHANGES</span>}
        </button>
      </form>
    </div>
  );
};

export default Settings;
