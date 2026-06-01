import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiUser, FiFolder } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import { getOptimizedUrl } from '../../utils/imageCompressor';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await firestoreService.getBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ['all', ...new Set(blogs.map(b => b.category).filter(Boolean))];
  const featured = blogs.filter(b => b.featured);

  const filtered = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) || (blog.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Thoughts, tutorials, and insights about web development and technology.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No blog posts yet. Check back soon!</div>
        ) : (
        <>
        {featured.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((post, i) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                    <img src={getOptimizedUrl(post.thumbnail || '')} alt={post.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center"><FiUser className="mr-1" />{post.author}</span>
                        <span className="flex items-center"><FiClock className="mr-1" />{post.readTime}</span>
                        <span className="flex items-center"><FiFolder className="mr-1" />{post.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all h-full">
                  <img src={getOptimizedUrl(post.thumbnail || '')} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="p-5">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <span>{post.publishDate?.split('T')[0] || ''}</span>
                      <span>{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </>
        )}
      </div>
    </div>
  );
}