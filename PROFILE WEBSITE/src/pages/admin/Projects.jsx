import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiExternalLink, FiGithub } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import { MultiImageUpload } from '../../components/common/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', technologies: '', category: 'web',
    liveUrl: '', githubUrl: '', featured: false, images: []
  });

  const fetchProjects = async () => {
    try {
      const data = await firestoreService.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      category: formData.category,
      liveUrl: formData.liveUrl || '',
      githubUrl: formData.githubUrl || '',
      featured: formData.featured,
      images: formData.images || []
    };

    try {
      if (editingProject) {
        await firestoreService.updateProject(editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await firestoreService.addProject(projectData);
        toast.success('Project created successfully');
      }
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      await fetchProjects();
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title, description: project.description,
      technologies: (project.technologies || []).join(', '), category: project.category,
      liveUrl: project.liveUrl || '', githubUrl: project.githubUrl || '',
      featured: project.featured || false, images: project.images || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await firestoreService.deleteProject(id);
        toast.success('Project deleted successfully');
        await fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', technologies: '', category: 'web', liveUrl: '', githubUrl: '', featured: false, images: [] });
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <button onClick={() => { setEditingProject(null); resetForm(); setShowModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
          <FiPlus /><span>Add Project</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Project</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Technologies</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Featured</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {projects.map((project, i) => (
                <motion.tr key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {project.images?.[0] && <img src={project.images[0]} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />}
                      <span className="font-medium text-gray-900 dark:text-white">{project.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{project.category}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(project.technologies || []).slice(0, 2).map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded-full">{t}</span>
                      ))}
                      {(project.technologies || []).length > 2 && <span className="text-xs text-gray-400">+{project.technologies.length - 2}</span>}
                    </div>
                  </td>
                  <td className="p-4">{project.featured && <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"><FiExternalLink /></a>}
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"><FiGithub /></a>}
                      <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><FiTrash2 /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No projects yet. Click "Add Project" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingProject ? 'Edit Project' : 'Add Project'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows="3"
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies (comma separated)</label>
                  <input value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600">
                    <option value="web">Web</option><option value="mobile">Mobile</option><option value="full-stack">Full Stack</option><option value="ai">AI</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL</label>
                    <input value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                    <input value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Images</label>
                  <MultiImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    folder="projects"
                    maxImages={10}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-600" />
                  <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Featured Project</label>
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}