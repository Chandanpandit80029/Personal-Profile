import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import { getOptimizedUrl } from '../../utils/imageCompressor';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await firestoreService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const filtered = activeCategory === 'all' ? projects : projects.filter(p => p.category === activeCategory);

  const openPopup = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">My Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A showcase of my recent projects and the technologies used to build them.</p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No projects available yet. Check back soon!</div>
        ) : (
        <>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((project, index) => (
              <motion.div key={project.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => openPopup(project)}>
                <div className="relative overflow-hidden">
                  <img src={getOptimizedUrl(project.images?.[0] || '')} alt={project.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || []).slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">{tech}</span>
                    ))}
                    {(project.technologies || []).length > 3 && <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>}
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
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={closePopup}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <img src={getOptimizedUrl(selectedProject.images?.[currentImageIndex] || '')} alt={selectedProject.title} className="w-full h-64 sm:h-80 object-cover rounded-t-2xl" loading="lazy" />
                {(selectedProject.images || []).length > 1 && (
                  <>
                    <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + selectedProject.images.length) % selectedProject.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><FiChevronLeft /></button>
                    <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % selectedProject.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><FiChevronRight /></button>
                  </>
                )}
                <button onClick={closePopup} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><FiX /></button>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedProject.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(selectedProject.technologies || []).map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all">
                    <FiExternalLink /><span>Live Demo</span>
                  </a>}
                  {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:border-purple-600 hover:text-purple-600 transition-all">
                    <FiGithub /><span>Source Code</span>
                  </a>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}