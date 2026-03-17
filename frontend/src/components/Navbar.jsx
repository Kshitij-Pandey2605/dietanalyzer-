import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, Utensils, Dumbbell, Calendar, Settings, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-[var(--primary)] to-emerald-400 bg-clip-text text-transparent tracking-tighter hover:scale-105 transition-transform">
          FitLife AI
        </Link>

        <div className="flex items-center space-x-3 md:space-x-5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          {user ? (
            <>
              <Link to="/" className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all font-semibold" title="Home">
                <Home size={20} />
                <span className="hidden xl:inline text-sm">Home</span>
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all font-semibold" title="Dashboard">
                <LayoutDashboard size={20} />
                <span className="hidden xl:inline text-sm">Dashboard</span>
              </Link>
              <Link to="/diet" className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all font-semibold" title="Diet">
                <Utensils size={20} />
                <span className="hidden xl:inline text-sm">Diet</span>
              </Link>
              <Link to="/workout" className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all font-semibold" title="Workout">
                <Dumbbell size={20} />
                <span className="hidden xl:inline text-sm">Workout</span>
              </Link>
              <Link to="/history" className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all font-semibold" title="History">
                <Calendar size={20} />
                <span className="hidden xl:inline text-sm">History</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all font-semibold" title="Profile">
                <UserIcon size={20} />
                <span className="hidden xl:inline text-sm">Profile</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all font-bold"
              >
                <LogOut size={20} />
                <span className="hidden md:inline text-sm">Exit</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-green-600 font-medium text-sm">Login</Link>
              <Link to="/signup" className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition font-bold text-sm shadow-lg shadow-green-600/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
