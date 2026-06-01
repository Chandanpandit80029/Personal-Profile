import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import toast from 'react-hot-toast';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const data = await firestoreService.getInquiries();
      setInquiries(data);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await firestoreService.updateInquiry(id, { status });
      toast.success(`Status updated to ${status}`);
      await fetchInquiries();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      try { await firestoreService.deleteInquiry(id); toast.success('Inquiry deleted'); await fetchInquiries(); }
      catch (err) { toast.error('Failed to delete inquiry'); }
    }
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', contacted: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Inquiries</h1>
      {inquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No inquiries yet.</div>
      ) : (
      <div className="space-y-4">
        {inquiries.map((inq, i) => (
          <motion.div key={inq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{inq.name}</h3>
                <p className="text-sm text-gray-500">{inq.email} - {inq.service}</p>
                <p className="text-xs text-gray-400">{inq.createdAt?.toDate?.().toLocaleDateString() || new Date(inq.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select value={inq.status} onChange={e => updateStatus(inq.id, e.target.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium border-none cursor-pointer ${statusColors[inq.status] || statusColors.pending}`}>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={() => handleDelete(inq.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><FiTrash2 /></button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{inq.message}</p>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}