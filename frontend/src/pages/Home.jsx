import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Utensils, Dumbbell, TrendingUp, ChevronRight, Heart, Shield, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-40 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_40%),radial-gradient(circle_at_bottom_left,var(--primary)_0%,transparent_30%)] opacity-10 dark:opacity-20 animate-pulse"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-12 animate-premium">
            <div className="inline-flex items-center gap-2 px-5 py-2 glass text-[var(--primary)] rounded-full text-sm font-bold tracking-widest uppercase shadow-xl">
              <Zap size={16} className="animate-pulse" /> AI-Powered Fitness Evolution
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[var(--foreground)] leading-[1.1] tracking-tight">
              Master Your <br />
              <span className="bg-gradient-to-r from-[var(--primary)] to-emerald-400 bg-clip-text text-transparent italic">Physical Destiny</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed font-medium">
              Precision analytics meets personalized coaching. Experience the future of health with FitLife AI's premium intelligent ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              {user ? (
                <Link to="/dashboard" className="btn-premium flex items-center justify-center gap-2 px-12 text-lg shadow-2xl shadow-[var(--primary)]/30">
                  Enter Dashboard <ChevronRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-premium flex items-center justify-center gap-2 px-12 text-lg shadow-2xl shadow-[var(--primary)]/30">
                    Begin Transformation <ChevronRight className="group-hover:translate-x-2 transition-transform" size={24} />
                  </Link>
                  <Link to="/login" className="px-12 py-4 rounded-xl font-bold text-lg border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all glass">
                    Member Portal
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4 bg-[var(--accent)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-premium">
            <h2 className="text-5xl font-black text-[var(--foreground)] mb-6 tracking-tight">Ecosystem Features</h2>
            <p className="text-[var(--muted-foreground)] text-xl max-w-2xl mx-auto font-medium leading-relaxed">A complete high-performance health architecture designed for your evolution.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Activity, title: 'Precision Body Intel', desc: 'Medical-grade BMI tracking, body phenotype analysis, and adaptive intake algorithms.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Utensils, title: 'Chef-Curated AI Diet', desc: 'Gourmet meal archetypes with full molecular nutrient profiling for peak performance.', gradient: 'from-green-500 to-emerald-500' },
              { icon: Dumbbell, title: 'Elite Training Matrix', desc: 'Dynamic biomechanical exercise protocols engineered for your specific physiological goals.', gradient: 'from-orange-500 to-red-500' },
              { icon: TrendingUp, title: 'Neural Progress Sync', desc: 'Predictive analytics and metabolic trend visualization to maintain ultimate consistency.', gradient: 'from-purple-500 to-violet-500' },
            ].map((feature, i) => (
              <div key={i} className="premium-card p-10 glass group animate-premium" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br ${feature.gradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--foreground)]">{feature.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed font-medium">{feature.desc}</p>
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
      <section className="py-24 px-4 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] opacity-5 blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-[var(--secondary)] to-black rounded-[2rem] p-16 md:p-24 shadow-2xl relative z-10 animate-premium">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
            <TrendingUp size={200} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">Initiate Your <br /> Transformation</h2>
          <p className="text-gray-400 mb-12 text-xl max-w-2xl mx-auto font-medium leading-relaxed">Join the elite stratum of users already achieving biological optimization with FitLife AI's premium infrastructure.</p>
          <Link to={user ? "/dashboard" : "/signup"} className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/90 transition-all group shadow-2xl hover:scale-105 active:scale-95">
            {user ? 'Enter Command Center' : 'Create Free Identity'} <ChevronRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-4 text-center text-sm text-[var(--muted-foreground)]">
        <p>&copy; 2026 FitLife AI — Built by Kshitij Pandey</p>
      </footer>
    </div>
  );
};

export default Home;
