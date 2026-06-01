import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiTrash2, FiX } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import ImageUpload from '../../components/common/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ imageUrl: '', title: '', category: '' });

  const fetchGallery = async () => {
    try {
      const data = await firestoreService.getGallery();
      setImages(data);
    } catch (err) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error('Please upload an image first');
      return;
    }
    try {
      await firestoreService.addGalleryImage({ imageUrl: form.imageUrl, title: form.title, category: form.category });
      toast.success('Image added');
      setShowModal(false);
      setForm({ imageUrl: '', title: '', category: '' });
      await fetchGallery();
    } catch (err) {
      toast.error('Failed to add image');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) {
      try { await firestoreService.deleteGalleryImage(id); toast.success('Image deleted'); await fetchGallery(); }
      catch (err) { toast.error('Failed to delete image'); }
    }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"><FiUpload /><span>Add Image</span></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, i) => (
          <motion.div key={image.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="relative group">
            <img src={image.imageUrl} alt={image.title} className="w-full h-48 object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <p className="font-medium">{image.title}</p>
                <p className="text-sm text-gray-300">{image.category}</p>
                <button onClick={() => handleDelete(image.id)} className="mt-2 p-2 bg-red-500 rounded-full"><FiTrash2 className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">No images yet. Click "Add Image" to upload one.</div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add Image</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>
                  <ImageUpload
                    onUpload={(url) => setForm({ ...form, imageUrl: url })}
                    onRemove={() => setForm({ ...form, imageUrl: '' })}
                    folder="gallery"
                  />
                </div>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">Add Image</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}