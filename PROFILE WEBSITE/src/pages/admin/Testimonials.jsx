import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import ImageUpload from '../../components/common/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ clientName: '', designation: '', review: '', rating: 5, photo: '' });

  const fetchTestimonials = async () => {
    try {
      const data = await firestoreService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await firestoreService.updateTestimonial(editing.id, form);
        toast.success('Testimonial updated');
      } else {
        await firestoreService.addTestimonial(form);
        toast.success('Testimonial added');
      }
      setShowModal(false);
      setEditing(null);
      await fetchTestimonials();
    } catch (err) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleEdit = (t) => { setEditing(t); setForm({ clientName: t.clientName, designation: t.designation || '', review: t.review, rating: t.rating, photo: t.photo || '' }); setShowModal(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try { await firestoreService.deleteTestimonial(id); toast.success('Testimonial deleted'); await fetchTestimonials(); }
      catch (err) { toast.error('Failed to delete testimonial'); }
    }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
        <button onClick={() => { setEditing(null); setForm({ clientName: '', designation: '', review: '', rating: 5, photo: '' }); setShowModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"><FiPlus /><span>Add Testimonial</span></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              {t.photo && <img src={t.photo} alt={t.clientName} className="w-12 h-12 rounded-full object-cover mr-3" />}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.clientName}</h3>
                {t.designation && <p className="text-sm text-gray-500">{t.designation}</p>}
              </div>
              <div className="flex space-x-1">
                <button onClick={() => handleEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex mb-2">{[...Array(5)].map((_, i) => <FiStar key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{t.review}"</p>
          </motion.div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">No testimonials yet. Click "Add Testimonial" to create one.</div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Testimonial</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Client Name" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="Designation" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <textarea value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} placeholder="Review" rows="3" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Photo</label>
                  <ImageUpload
                    currentUrl={form.photo}
                    onUpload={(url) => setForm({ ...form, photo: url })}
                    onRemove={() => setForm({ ...form, photo: '' })}
                    folder="testimonials"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">{editing ? 'Update' : 'Add'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}