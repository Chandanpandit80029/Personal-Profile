import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import ImageUpload from '../../components/common/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', features: '' });

  const fetchServices = async () => {
    try {
      const data = await firestoreService.getServices();
      setServices(data);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name, description: form.description, price: form.price,
      image: form.image || '',
      features: form.features.split(',').map(f => f.trim()).filter(f => f)
    };
    try {
      if (editing) {
        await firestoreService.updateService(editing.id, data);
        toast.success('Service updated');
      } else {
        await firestoreService.addService(data);
        toast.success('Service created');
      }
      setShowModal(false); setEditing(null);
      await fetchServices();
    } catch (err) {
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name, description: s.description, price: s.price,
      image: s.image || '', features: (s.features || []).join(', ')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try { await firestoreService.deleteService(id); toast.success('Service deleted'); await fetchServices(); }
      catch (err) { toast.error('Failed to delete service'); }
    }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', image: '', features: '' }); setShowModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"><FiPlus /><span>Add Service</span></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
              <div className="flex space-x-1">
                <button onClick={() => handleEdit(service)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(service.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {service.image && <img src={service.image} alt={service.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{service.description}</p>
            <p className="text-2xl font-bold text-purple-600 mb-3">{service.price}</p>
            <div className="flex flex-wrap gap-1">
              {(service.features || []).map((f, i) => <span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">{f}</span>)}
            </div>
          </motion.div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">No services yet. Click "Add Service" to create one.</div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit Service' : 'Add Service'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Service Name" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows="2" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (e.g. ₹999+)" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Image</label>
                  <ImageUpload
                    currentUrl={form.image}
                    onUpload={(url) => setForm({ ...form, image: url })}
                    onRemove={() => setForm({ ...form, image: '' })}
                    folder="services"
                  />
                </div>
                <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Features (comma separated)" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg">{editing ? 'Update' : 'Create'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}