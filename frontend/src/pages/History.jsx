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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-green-600" /> Progress History
          </h1>
          <p className="text-gray-500 mt-1">Review your journey over the past weeks</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
             <Filter size={16} /> Filter
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Weight</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Calories</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Water</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Workout</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">{log.weight} kg</td>
                  <td className="px-6 py-4">{log.caloriesConsumed} kcal</td>
                  <td className="px-6 py-4">{log.waterIntake} L</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${log.workoutCompleted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.workoutCompleted ? 'Done' : 'Missed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(log._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">No logs found. Start tracking today!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-50 dark:border-gray-700"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-sm">Page {page} of {pages}</span>
          <button 
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-50 dark:border-gray-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
