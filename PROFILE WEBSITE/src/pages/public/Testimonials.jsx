import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import { getOptimizedUrl } from '../../utils/imageCompressor';

const renderStars = (rating) => {
  return Array(5).fill(0).map((_, i) => (
    <FiStar key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
  ));
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await firestoreService.getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">Testimonials</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">What my clients say about working with me.</p>
        </motion.div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No testimonials yet.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all relative"
            >
              <svg className="absolute top-4 right-4 w-8 h-8 text-purple-200 dark:text-purple-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/>
              </svg>
              
              <div className="flex items-center mb-6">
                {testimonial.photo && (
                  <img
                    src={getOptimizedUrl(testimonial.photo)}
                    alt={testimonial.clientName}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-200"
                    loading="lazy"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.clientName}</h3>
                  {testimonial.designation && <p className="text-sm text-gray-500">{testimonial.designation}</p>}
                </div>
              </div>

              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">"{testimonial.review}"</p>
              
              <div className="mt-6 text-sm text-gray-400">
                {testimonial.createdAt?.toDate?.().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) || 
                 new Date(testimonial.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}