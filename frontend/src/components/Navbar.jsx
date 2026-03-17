import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, Utensils, Dumbbell, Calendar, Settings, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          FitLife AI
        </Link>

        <div className="flex items-center space-x-3 md:space-x-5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          {user ? (
            <>
              <Link to="/" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="Home">
                <Home size={18} />
                <span className="hidden xl:inline text-sm font-medium">Home</span>
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="Dashboard">
                <LayoutDashboard size={18} />
                <span className="hidden xl:inline text-sm font-medium">Dashboard</span>
              </Link>
              <Link to="/diet" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="Diet">
                <Utensils size={18} />
                <span className="hidden xl:inline text-sm font-medium">Diet</span>
              </Link>
              <Link to="/workout" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="Workout">
                <Dumbbell size={18} />
                <span className="hidden xl:inline text-sm font-medium">Workout</span>
              </Link>
              <Link to="/history" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="History">
                <Calendar size={18} />
                <span className="hidden xl:inline text-sm font-medium">History</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="Profile">
                <UserIcon size={18} />
                <span className="hidden xl:inline text-sm font-medium">Profile</span>
              </Link>
              <Link to="/settings" className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-600 transition" title="Settings">
                <Settings size={18} />
                <span className="hidden xl:inline text-sm font-medium">Settings</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="hidden md:inline text-sm font-medium">Logout</span>
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
