import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import toast from 'react-hot-toast';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await firestoreService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    try {
      await firestoreService.addMessage({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      });
      toast.success('Message sent successfully! I will get back to you soon.');
      reset();
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const email = settings?.email || 'john@example.com';
  const phone = settings?.phone || '+1 (555) 123-4567';
  const location = settings?.location || 'San Francisco, CA';

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Have a project in mind or just want to say hello? I'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-8 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400">{email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400">{phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">{location}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Me</h3>
              <div className="flex space-x-3">
                {[FiGithub, FiLinkedin, FiTwitter, FiInstagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-purple-600 dark:hover:bg-purple-600 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden h-64">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.14245968247!2d-122.43759999999999!3d37.75769999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input {...register('name', { required: true })} placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
                </div>
                <div>
                  <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">Valid email is required</p>}
                </div>
              </div>
              <div>
                <input {...register('subject', { required: true })} placeholder="Subject"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
              </div>
              <div>
                <textarea {...register('message', { required: true })} rows="6" placeholder="Your Message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                <FiSend /><span>Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}