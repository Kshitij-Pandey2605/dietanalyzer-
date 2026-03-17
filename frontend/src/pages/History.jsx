import { useState, useEffect } from 'react';
import progressService from '../services/progressService';
import { Calendar, Trash2, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Filter } from 'lucide-react';

const History = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await progressService.getHistory(page);
      setLogs(data.logs);
      setPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await progressService.deleteLog(id);
        fetchLogs();
      } catch (err) {
        alert('Failed to delete log');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading your history...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-premium">
        <div>
          <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Progress Journey</h1>
          <p className="text-[var(--muted-foreground)] mt-2 font-medium">Detailed historical logs of your biological evolution</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 glass dark:glass-dark rounded-xl text-sm font-bold border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition-all">
             <Filter size={18} /> Refine View
           </button>
        </div>
      </div>

      <div className="premium-card glass overflow-hidden animate-premium" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--muted)] border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em]">Timeline</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em]">Mass (kg)</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em]">Fuel (kcal)</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em]">Hydration</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em]">Protocol</th>
                <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.2em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border)] divide-[var(--border)]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-[var(--primary)]/5 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap font-bold text-[var(--foreground)]">
                    {new Date(log.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 font-black text-[var(--primary)]">{log.weight}</td>
                  <td className="px-8 py-5 font-medium">{log.caloriesConsumed}</td>
                  <td className="px-8 py-5 font-medium">{log.waterIntake}L</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${log.workoutCompleted ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {log.workoutCompleted ? 'Success' : 'Missed'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(log._id)}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group-hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center text-[var(--muted-foreground)] italic font-medium">No tracking sequences detected. Initiate logging protocols.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-8 animate-premium" style={{ animationDelay: '200ms' }}>
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-3 border border-[var(--border)] rounded-2xl disabled:opacity-20 hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-black text-lg tracking-widest">PAGE {page} <span className="text-[var(--muted-foreground)] px-2">/</span> {pages}</span>
          <button 
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="p-3 border border-[var(--border)] rounded-2xl disabled:opacity-20 hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
