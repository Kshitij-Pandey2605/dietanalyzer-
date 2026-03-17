import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/30 p-8 md:p-10 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-2xl mb-4">
              <UserCheck className="text-green-600" size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Log in to track your progress</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center mb-6 border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
