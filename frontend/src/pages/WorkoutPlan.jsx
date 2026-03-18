import { useState, useEffect, useRef } from 'react';
import workoutService from '../services/workoutService';
import progressService from '../services/progressService';
import { Dumbbell, Timer, Flame, CheckCircle, PlayCircle, StopCircle, SkipForward, Trophy } from 'lucide-react';

const parseDuration = (dur = '') => {
  const match = dur.match(/(\d+)/);
  return match ? parseInt(match[1]) : 5;
};

const WorkoutPlan = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    workoutService.getWorkoutPlan()
      .then(data => setWorkouts(data.exercises || []))
      .catch(err => setError(err.response?.data?.message || 'Please complete your profile first.'))
      .finally(() => setLoading(false));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setTimerRunning(false);
            if (activeTimer !== null) markDone(activeTimer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, activeTimer]);

  // Check all completed
  useEffect(() => {
    if (workouts.length > 0 && workouts.every((_, i) => completed[i])) {
      setWorkoutDone(true);
    }
  }, [completed, workouts]);

  const markDone = (idx) => setCompleted(prev => ({ ...prev, [idx]: true }));

  const startTimer = (idx) => {
    clearInterval(intervalRef.current);
    const mins = parseDuration(workouts[idx]?.duration);
    setActiveTimer(idx);
    setTimeLeft(mins * 60);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
  };

  // Skip = immediately mark this exercise as done and stop timer
  const skipTimer = (idx) => {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
    setTimeLeft(0);
    markDone(idx);
  };

  const toggleComplete = (idx) => {
    if (activeTimer === idx && timerRunning) stopTimer();
    setCompleted(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalMinutes = workouts.reduce((acc, w) => acc + parseDuration(w.duration), 0);
  const completedCount = Object.values(completed).filter(Boolean).length;

  const handleMarkWorkoutDone = async () => {
    setSaving(true);
    try {
      await progressService.createLog({ workoutCompleted: true });
      setWorkoutDone(true);
    } catch {
      alert('Failed to save workout. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--muted-foreground)] font-medium">Loading your training plan…</p>
      </div>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-premium">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)]">Daily Training</h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm md:text-base">Tailored exercises for your fitness goals</p>
        </div>
        <div className="flex gap-3">
          <div className="premium-card px-4 py-2 glass text-center min-w-[80px]">
            <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Est. Time</p>
            <p className="font-bold text-lg">~{totalMinutes}m</p>
          </div>
          <div className="premium-card px-4 py-2 glass text-center min-w-[80px]">
            <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Done</p>
            <p className="font-bold text-lg">{completedCount}/{workouts.length}</p>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="w-full bg-[var(--muted)] rounded-full h-2">
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-700"
          style={{ width: `${workouts.length ? (completedCount / workouts.length) * 100 : 0}%` }}
        />
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3">
        {workouts.map((exo, idx) => {
          const isActive = activeTimer === idx;
          const isDone = completed[idx];
          const progress = isActive && parseDuration(exo.duration) * 60 > 0
            ? (timeLeft / (parseDuration(exo.duration) * 60)) * 100 : 0;

          return (
            <div
              key={idx}
              className={`premium-card glass p-4 md:p-5 animate-premium transition-all ${isDone ? 'border border-green-500/40 bg-green-500/5' : ''}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                {/* Left: icon + info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${isDone ? 'opacity-40 scale-90' : ''}`}>
                    {isDone ? <CheckCircle size={22} /> : <Dumbbell size={22} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-sm md:text-base truncate ${isDone ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>{exo.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1"><Timer size={12} /> {exo.duration}</span>
                      <span className="flex items-center gap-1"><Flame size={12} /> {exo.sets}×{exo.reps}</span>
                    </div>
                  </div>
                </div>

                {/* Right: difficulty + timer controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    exo.difficulty === 'Hard' || exo.difficulty === 'Expert' ? 'bg-red-500/10 text-red-500' :
                    exo.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                  }`}>{exo.difficulty}</span>

                  {!isDone && (
                    <>
                      <button onClick={() => startTimer(idx)} title="Start Timer"
                        className="p-1.5 hover:bg-[var(--muted)] rounded-full transition">
                        <PlayCircle size={26} className="text-[var(--primary)]" />
                      </button>
                      {isActive && timerRunning && (
                        <>
                          <button onClick={stopTimer} title="Pause"
                            className="p-1.5 hover:bg-[var(--muted)] rounded-full transition">
                            <StopCircle size={22} className="text-orange-500" />
                          </button>
                          <button onClick={() => skipTimer(idx)} title="Skip — Mark Done"
                            className="p-1.5 hover:bg-[var(--muted)] rounded-full transition">
                            <SkipForward size={22} className="text-blue-500" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Timer display */}
              {isActive && (timeLeft > 0 || timerRunning) && (
                <div className="mt-3 p-3 rounded-2xl bg-[var(--muted)] flex items-center gap-4">
                  <span className="text-2xl md:text-3xl font-mono font-bold text-[var(--primary)] tabular-nums w-24 text-center">
                    {formatTime(timeLeft)}
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-[var(--border)] rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)] font-medium hidden sm:block">
                    {timerRunning ? 'Running…' : 'Paused'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA / Completion Banner */}
      {workoutDone ? (
        <div className="p-8 bg-gradient-to-br from-green-500 to-emerald-700 rounded-[var(--radius)] text-white text-center shadow-2xl animate-premium">
          <Trophy size={48} className="mx-auto mb-3 text-yellow-300" />
          <h3 className="text-3xl font-black mb-2">Well Done! 🔥</h3>
          <p className="text-green-100 opacity-90">Workout logged. Your streak is growing! 💪</p>
        </div>
      ) : (
        <div className="p-6 md:p-8 bg-gradient-to-br from-[var(--primary)] to-emerald-700 rounded-[var(--radius)] text-white shadow-2xl relative overflow-hidden animate-premium">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Flame size={160} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 relative z-10">
            {completedCount > 0 ? `${completedCount}/${workouts.length} done — Keep Going! 💪` : 'Ready to start?'}
          </h3>
          <p className="text-green-50 opacity-90 mb-6 max-w-md relative z-10 text-sm md:text-base">
            Check off exercises or hit ▶ to start timers. Use ⏭ to skip if you finish early.
          </p>
          {completedCount === workouts.length && workouts.length > 0 ? (
            <button onClick={handleMarkWorkoutDone} disabled={saving}
              className="bg-white text-[var(--primary)] px-8 py-3 rounded-2xl font-bold hover:bg-green-50 transition-all flex items-center gap-2 relative z-10 hover:shadow-xl active:scale-95">
              {saving ? 'Saving…' : <><Trophy size={18} /> Save Workout & Update Streak</>}
            </button>
          ) : (
            <p className="text-sm text-green-100/80 relative z-10">Complete all exercises above to save!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
