import { useState, useEffect } from 'react';
import progressService from '../services/progressService';
import { Calendar, Trash2, ChevronLeft, ChevronRight, Filter, X, CheckCircle, XCircle } from 'lucide-react';

const History = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({ workoutStatus: 'all', sortBy: 'date', order: 'desc' });
  const [appliedFilter, setAppliedFilter] = useState(filter);

  useEffect(() => {
    fetchLogs();
  }, [page, appliedFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        sortBy: appliedFilter.sortBy,
        order: appliedFilter.order,
      };
      const data = await progressService.getHistory(page, params);
      
      let filtered = data.logs || [];
      if (appliedFilter.workoutStatus === 'completed') filtered = filtered.filter(l => l.workoutCompleted);
      if (appliedFilter.workoutStatus === 'missed') filtered = filtered.filter(l => !l.workoutCompleted);
      
      setLogs(filtered);
      setPages(data.totalPages || data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    setPage(1);
    setAppliedFilter({ ...filter });
    setShowFilter(false);
  };

  const resetFilter = () => {
    const def = { workoutStatus: 'all', sortBy: 'date', order: 'desc' };
    setFilter(def);
    setAppliedFilter(def);
    setPage(1);
    setShowFilter(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this log?')) {
      try {
        await progressService.deleteLog(id);
        fetchLogs();
      } catch (err) {
        alert('Failed to delete log');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-premium">
        <div>
          <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Progress Journey</h1>
          <p className="text-[var(--muted-foreground)] mt-2 font-medium">Detailed historical logs of your evolution</p>
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-6 py-3 glass rounded-xl text-sm font-bold border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition-all ${showFilter ? 'bg-[var(--primary)] text-white' : ''}`}
        >
          <Filter size={18} /> Refine View
        </button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="premium-card glass p-6 animate-premium border border-[var(--primary)]/20 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-[var(--foreground)]">Filter Options</h3>
            <button onClick={() => setShowFilter(false)}><X size={18} className="text-[var(--muted-foreground)]" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Workout status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Workout Status</label>
              <select
                className="w-full p-2 rounded-xl border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                value={filter.workoutStatus}
                onChange={e => setFilter({ ...filter, workoutStatus: e.target.value })}
              >
                <option value="all">All</option>
                <option value="completed">Completed ✅</option>
                <option value="missed">Missed ❌</option>
              </select>
            </div>
            {/* Sort by */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Sort By</label>
              <select
                className="w-full p-2 rounded-xl border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                value={filter.sortBy}
                onChange={e => setFilter({ ...filter, sortBy: e.target.value })}
              >
                <option value="date">Date</option>
                <option value="weight">Weight</option>
                <option value="caloriesConsumed">Calories</option>
              </select>
            </div>
            {/* Order */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Order</label>
              <select
                className="w-full p-2 rounded-xl border border-[var(--border)] bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                value={filter.order}
                onChange={e => setFilter({ ...filter, order: e.target.value })}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={applyFilter} className="btn-premium px-6 py-2 text-sm">Apply Filters</button>
            <button onClick={resetFilter} className="px-6 py-2 text-sm font-semibold border border-[var(--border)] rounded-xl hover:bg-[var(--muted)] transition">Reset</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[var(--muted-foreground)]">Loading history...</div>
      ) : (
        <div className="animate-premium" style={{ animationDelay: '100ms' }}>
          {/* Mobile View: Card Layout */}
          <div className="md:hidden space-y-4">
            {logs.map((log) => (
              <div key={log._id} className="premium-card glass p-5 space-y-4 relative group transition-all hover:border-[var(--primary)]/30">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Date</p>
                    <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                      <Calendar size={14} className="text-[var(--primary)]" />
                      {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="p-2 text-red-500 bg-red-500/5 rounded-xl active:scale-90 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Weight</p>
                    <p className="font-black text-lg text-[var(--primary)]">{log.weight ? `${log.weight} kg` : '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Calories</p>
                    <p className="font-bold text-[var(--foreground)]">{log.caloriesConsumed ? `${log.caloriesConsumed} kcal` : '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Water</p>
                    <p className="font-bold text-[var(--foreground)]">{log.waterIntake ? `${log.waterIntake} L` : '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Workout</p>
                    {log.workoutCompleted
                      ? <span className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase tracking-widest"><CheckCircle size={12} /> Done</span>
                      : <span className="flex items-center gap-1 text-red-500 text-[10px] font-black uppercase tracking-widest"><XCircle size={12} /> Missed</span>
                    }
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="premium-card glass p-10 text-center text-[var(--muted-foreground)] italic font-medium">
                No logs found.
              </div>
            )}
          </div>

          {/* Desktop View: Table Layout */}
          <div className="hidden md:block premium-card glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--muted)] border-b border-[var(--border)] text-[var(--muted-foreground)]">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Weight (kg)</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Calories</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Water (L)</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Workout</th>
                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-[var(--primary)]/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-[var(--foreground)] whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-[var(--muted-foreground)]" />
                          {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-[var(--primary)]">{log.weight || '—'}</td>
                      <td className="px-6 py-4 font-medium text-[var(--foreground)]">{log.caloriesConsumed || '—'}</td>
                      <td className="px-6 py-4 font-medium text-[var(--foreground)]">{log.waterIntake ? `${log.waterIntake}L` : '—'}</td>
                      <td className="px-6 py-4">
                        {log.workoutCompleted
                          ? <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest w-fit"><CheckCircle size={12} /> Done</span>
                          : <span className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest w-fit"><XCircle size={12} /> Missed</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(log._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center text-[var(--muted-foreground)] italic font-medium">
                        No logs found. Try removing filters or start logging your progress!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-6 animate-premium" style={{ animationDelay: '200ms' }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}
            className="p-3 border border-[var(--border)] rounded-2xl disabled:opacity-20 hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg active:scale-95">
            <ChevronLeft size={22} />
          </button>
          <span className="font-black tracking-widest">PAGE {page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}
            className="p-3 border border-[var(--border)] rounded-2xl disabled:opacity-20 hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg active:scale-95">
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
