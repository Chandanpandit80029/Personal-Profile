import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiFileText, FiServer, FiImage, FiStar, FiMail, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { firestoreService } from '../../services/firestoreService';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const statConfigs = [
  { label: 'Total Projects', key: 'totalProjects', icon: FiFolder, color: 'from-purple-500 to-purple-700' },
  { label: 'Total Blog Posts', key: 'totalBlogs', icon: FiFileText, color: 'from-blue-500 to-blue-700' },
  { label: 'Total Services', key: 'totalServices', icon: FiServer, color: 'from-green-500 to-green-700' },
  { label: 'Gallery Images', key: 'totalGallery', icon: FiImage, color: 'from-pink-500 to-pink-700' },
  { label: 'Testimonials', key: 'totalTestimonials', icon: FiStar, color: 'from-yellow-500 to-yellow-700' },
  { label: 'Messages', key: 'totalMessages', icon: FiMail, color: 'from-red-500 to-red-700' },
];

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
    x: { grid: { display: false } },
  },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await firestoreService.getDashboardStats();
        setStats(data);
      } catch (err) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projects',
        data: [2, 3, 1, 4, 2, stats?.totalProjects || 0],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Blog Posts',
        data: [1, 2, 3, 1, 2, stats?.totalBlogs || 0],
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['Projects', 'Blogs', 'Services', 'Gallery', 'Testimonials'],
    datasets: [
      {
        data: [
          stats?.totalProjects || 0,
          stats?.totalBlogs || 0,
          stats?.totalServices || 0,
          stats?.totalGallery || 0,
          stats?.totalTestimonials || 0,
        ],
        backgroundColor: ['#7c3aed', '#3b82f6', '#10b981', '#ec4899', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse grid grid-cols-6 gap-4"><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div></div></div>;
  }

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statConfigs.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className={`w-10 h-10 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.[card.key] || 0}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h2>
            <Line data={lineData} options={chartOptions} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Distribution</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}