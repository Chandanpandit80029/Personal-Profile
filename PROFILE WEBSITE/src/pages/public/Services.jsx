import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiCode, FiSmartphone, FiPenTool, FiCloud, FiCheck, FiSend } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import toast from 'react-hot-toast';

const iconMap = [FiCode, FiSmartphone, FiPenTool, FiCloud];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await firestoreService.getServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    try {
      await firestoreService.addInquiry({
        name: data.name,
        email: data.email,
        service: data.service,
        message: data.message
      });
      toast.success('Inquiry submitted successfully! We will get back to you soon.');
      reset();
    } catch (err) {
      toast.error('Failed to submit inquiry. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 bg-white dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">My Services</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Professional services to help bring your ideas to life with cutting-edge technology and best practices.</p>
        </motion.div>

        {services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No services available yet.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedService(service)}
                className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${selectedService?.id === service.id ? 'ring-2 ring-purple-600' : ''}`}>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">{service.price}</p>
                <ul className="space-y-2">
                  {(service.features || []).map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-green-500 mr-2" />{f}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Service Inquiry</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input {...register('name', { required: true })} placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
              {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
            </div>
            <div>
              <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="Your Email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
              {errors.email && <p className="text-red-500 text-sm mt-1">Valid email is required</p>}
            </div>
            <div>
              <select {...register('service', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600">
                <option value="">Select Service</option>
                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <textarea {...register('message', { required: true })} rows="5" placeholder="Describe your project..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <FiSend /><span>Submit Inquiry</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}