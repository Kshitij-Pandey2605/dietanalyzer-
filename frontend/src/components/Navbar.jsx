import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, Utensils, Dumbbell, Calendar, Home, Menu, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { to: '/',          icon: Home,            label: 'Home'      },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/diet',      icon: Utensils,        label: 'Diet'      },
  { to: '/workout',   icon: Dumbbell,        label: 'Workout'   },
  { to: '/history',   icon: Calendar,        label: 'History'   },
  { to: '/profile',   icon: UserIcon,        label: 'Profile'   },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      {/* ── Top bar ── */}
      <nav className="glass sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="hover:scale-105 transition-transform shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive(to)
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors"
              title="Toggle theme"
            >
              {darkMode
                ? <Sun size={18} className="text-yellow-400" />
                : <Moon size={18} className="text-gray-500" />}
            </button>

            {user ? (
              <>
                {/* User chip (desktop) */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--muted)] rounded-xl text-sm font-semibold text-[var(--foreground)]">
                  <div className="w-6 h-6 bg-gradient-to-br from-[var(--primary)] to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block max-w-[120px] truncate">{user.name}</span>
                </div>

                {/* Logout (desktop) */}
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-1.5 text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all font-bold text-sm"
                >
                  <LogOut size={16} />
                  <span>Exit</span>
                </button>

                {/* Hamburger (mobile) */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-[var(--muted)] transition"
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition px-2 py-1.5">Login</Link>
                <Link to="/signup" className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl hover:opacity-90 transition font-bold text-sm shadow-lg">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && user && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 space-y-1 animate-premium">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-[var(--muted)] rounded-2xl">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary)] to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-black text-sm text-[var(--foreground)]">{user.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
              </div>
            </div>

            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive(to)
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}

            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-bold text-sm mt-1"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* ── Mobile bottom navigation bar ── */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)] backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
            {navLinks.map(({ to, icon: Icon, label }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                    active ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[var(--primary)]/10' : ''}`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${active ? 'text-[var(--primary)]' : ''}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
