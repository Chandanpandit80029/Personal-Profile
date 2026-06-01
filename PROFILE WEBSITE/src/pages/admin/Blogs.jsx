import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import ImageUpload from '../../components/common/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', thumbnail: '', featured: false });

  const fetchBlogs = async () => {
    try {
      const data = await firestoreService.getBlogs();
      setBlogs(data);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      thumbnail: formData.thumbnail || '',
      featured: formData.featured,
      readTime: '5 min read',
      author: 'Admin'
    };

    try {
      if (editingBlog) {
        await firestoreService.updateBlog(editingBlog.id, blogData);
        toast.success('Blog updated successfully');
      } else {
        await firestoreService.addBlog(blogData);
        toast.success('Blog created successfully');
      }
      setShowModal(false);
      setEditingBlog(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', thumbnail: '', featured: false });
      await fetchBlogs();
    } catch (err) {
      toast.error('Failed to save blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '', content: blog.content || '',
      category: blog.category, tags: (blog.tags || []).join(', '), thumbnail: blog.thumbnail || '',
      featured: blog.featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog?')) {
      try { await firestoreService.deleteBlog(id); toast.success('Blog deleted'); await fetchBlogs(); }
      catch (err) { toast.error('Failed to delete blog'); }
    }
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <button onClick={() => { setEditingBlog(null); setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', thumbnail: '', featured: false }); setShowModal(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
          <FiPlus /><span>Add Blog</span>
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Featured</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {blogs.map((blog, i) => (
              <motion.tr key={blog.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-10 h-10 rounded-lg object-cover" />}
                    <span className="font-medium text-gray-900 dark:text-white">{blog.title}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">{blog.category}</td>
                <td className="p-4 text-sm text-gray-500">{blog.publishDate?.split('T')[0] || blog.createdAt?.toDate?.().toISOString().split('T')[0]}</td>
                <td className="p-4">{blog.featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Featured</span>}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><FiTrash2 /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {blogs.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No blog posts yet. Click "Add Blog" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Title" required className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <input value={formData.slug} onChange={e => { setFormData({ ...formData, slug: e.target.value }); }} placeholder="Slug (auto-generated if empty)" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Excerpt" rows="2" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Content" rows="4" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Category" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image</label>
                  <ImageUpload
                    currentUrl={formData.thumbnail}
                    onUpload={(url) => setFormData({ ...formData, thumbnail: url })}
                    onRemove={() => setFormData({ ...formData, thumbnail: '' })}
                    folder="blogs"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="rounded text-purple-600" />
                  <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Featured Post</label>
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}