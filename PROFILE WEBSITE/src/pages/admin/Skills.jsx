import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import toast from 'react-hot-toast';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', percentage: 50, icon: '' });

  const fetchSkills = async () => {
    try {
      const data = await firestoreService.getSkills();
      setSkills(data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name: form.name, percentage: parseInt(form.percentage), icon: form.icon || '' };
    try {
      if (editing) {
        await firestoreService.updateSkill(editing.id, data);
        toast.success('Skill updated');
      } else {
        await firestoreService.addSkill(data);
        toast.success('Skill added');
      }
      setShowModal(false); setEditing(null);
      await fetchSkills();
    } catch (err) {
      toast.error('Failed to save skill');
    }
  };

  const handleEdit = (s) => { setEditing(s); setForm({ name: s.name, percentage: s.percentage, icon: s.icon || '' }); setShowModal(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) { try { await firestoreService.deleteSkill(id); toast.success('Skill deleted'); await fetchSkills(); } catch (err) { toast.error('Failed to delete skill'); } }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', percentage: 50, icon: '' }); setShowModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"><FiPlus /><span>Add Skill</span></button>
      </div>
      <div className="space-y-4">
        {skills.map((skill, i) => (
          <motion.div key={skill.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                <span className="text-sm text-purple-600 font-bold">{skill.percentage}%</span>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => handleEdit(skill)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all" style={{ width: `${skill.percentage}%` }}></div>
            </div>
          </motion.div>
        ))}
        {skills.length === 0 && (
          <div className="text-center py-12 text-gray-500">No skills yet. Click "Add Skill" to create one.</div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Skill</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Skill Name" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Percentage: {form.percentage}%</label>
                  <input type="range" min="1" max="100" value={form.percentage} onChange={e => setForm({ ...form, percentage: e.target.value })}
                    className="w-full accent-purple-600" />
                </div>
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Icon name (e.g., FaReact)" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">{editing ? 'Update' : 'Add'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}