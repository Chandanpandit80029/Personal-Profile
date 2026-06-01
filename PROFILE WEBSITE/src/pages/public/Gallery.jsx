import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiGrid } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import { getOptimizedUrl } from '../../utils/imageCompressor';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await firestoreService.getGallery();
        setGallery(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['all', ...new Set(gallery.map(g => g.category))];
  const filtered = activeCategory === 'all' ? gallery : gallery.filter(g => g.category === activeCategory);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigate = (direction) => {
    const newIndex = (currentIndex + direction + filtered.length) % filtered.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filtered[newIndex]);
  };

  if (loading) {
    return <div className="min-h-screen pt-20 bg-white dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A collection of photos showcasing my work, travels, and experiences.</p>
        </motion.div>

        {gallery.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No gallery images yet. Check back soon!</div>
        ) : (
        <>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((image, index) => (
              <motion.div key={image.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative group cursor-pointer rounded-xl overflow-hidden" onClick={() => openLightbox(image, index)}>
                <img src={getOptimizedUrl(image.imageUrl)} alt={image.title} loading="lazy" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FiGrid className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">{image.title}</p>
                    <p className="text-sm text-gray-300">{image.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        </>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"><FiX className="w-6 h-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"><FiChevronLeft className="w-6 h-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"><FiChevronRight className="w-6 h-6" /></button>
            
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <img src={getOptimizedUrl(selectedImage.imageUrl)} alt={selectedImage.title} className="w-full max-h-[80vh] object-contain rounded-2xl" loading="lazy" />
              <div className="text-center text-white mt-4">
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-gray-400">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}