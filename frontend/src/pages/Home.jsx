import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Utensils, Dumbbell, TrendingUp, ChevronRight, Heart, Shield, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-500/5 to-transparent dark:from-green-900/20 dark:via-emerald-900/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-bold tracking-wider uppercase">
              AI-Powered Fitness Coach
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight">
              Transform Your <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Health Journey</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Analyze your body metrics, get personalized diet and workout plans, and track your progress with intelligent analytics. Your digital fitness coach is here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Link to="/dashboard" className="group bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-600/25 flex items-center justify-center gap-2">
                  Go to Dashboard <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="group bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-600/25 flex items-center justify-center gap-2">
                    Get Started Free <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <Link to="/login" className="px-10 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">A complete health ecosystem powered by data-driven analysis</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Activity, title: 'Body Analytics', desc: 'BMI calculation, body category analysis, and personalized calorie recommendations.', color: 'blue' },
              { icon: Utensils, title: 'Smart Diet Plans', desc: 'Custom meal plans with full nutritional breakdown for every meal of the day.', color: 'green' },
              { icon: Dumbbell, title: 'Workout Routines', desc: 'AI-generated exercise programs matching your fitness level and goals.', color: 'orange' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Visual analytics, streak tracking, and motivational insights to keep you going.', color: 'purple' },
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { value: '10,000+', label: 'Active Users', icon: Heart },
            { value: '50,000+', label: 'Workouts Completed', icon: Zap },
            { value: '99.9%', label: 'Uptime Guarantee', icon: Shield },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <stat.icon className="mx-auto text-green-600" size={32} />
              <p className="text-4xl font-black text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 md:p-16 shadow-2xl shadow-green-600/20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Start Your Transformation Today</h2>
          <p className="text-green-50 opacity-90 mb-8 text-lg max-w-lg mx-auto">Join thousands of users who are already on their path to a healthier lifestyle with FitLife AI.</p>
          <Link to={user ? "/dashboard" : "/signup"} className="inline-flex items-center gap-2 bg-white text-green-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition group shadow-lg">
            {user ? 'View Dashboard' : 'Create Free Account'} <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4 text-center text-sm text-gray-400">
        <p>&copy; 2026 FitLife AI — Built by Kshitij Pandey</p>
      </footer>
    </div>
  );
};

export default Home;
