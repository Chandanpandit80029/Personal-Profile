import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiTrash2, FiCheck } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const data = await firestoreService.getMessages();
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id) => {
    try {
      await firestoreService.updateMessage(id, { read: true });
      toast.success('Marked as read');
      await fetchMessages();
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try { await firestoreService.deleteMessage(id); toast.success('Message deleted'); setSelectedMessage(null); await fetchMessages(); }
      catch (err) { toast.error('Failed to delete message'); }
    }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>
      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No messages yet.</div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMessage(msg)}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${!msg.read ? 'border-l-4 border-l-purple-600' : 'border-gray-100 dark:border-gray-700'} ${selectedMessage?.id === msg.id ? 'ring-2 ring-purple-600' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                <span className="text-xs text-gray-500">{msg.createdAt?.toDate?.().toLocaleDateString() || new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{msg.subject}</p>
              <p className="text-sm text-gray-500 truncate mt-1">{msg.message}</p>
              <div className="flex items-center space-x-2 mt-3">
                {!msg.read && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">New</span>}
                <span className="text-xs text-gray-400">{msg.email}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[300px]">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-500">{selectedMessage.name} - {selectedMessage.email}</p>
                  <p className="text-xs text-gray-400">{selectedMessage.createdAt?.toDate?.().toLocaleString() || new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {!selectedMessage.read && <button onClick={() => markAsRead(selectedMessage.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><FiCheck /></button>}
                  <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FiMail className="w-12 h-12 mx-auto mb-3" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}