import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiFolder, FiFileText, FiServer, FiImage, FiMessageCircle,
  FiUsers, FiMail, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight,
  FiMenu, FiX, FiStar, FiBarChart2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/admin/projects', label: 'Projects', icon: FiFolder },
  { path: '/admin/blogs', label: 'Blogs', icon: FiFileText },
  { path: '/admin/services', label: 'Services', icon: FiServer },
  { path: '/admin/gallery', label: 'Gallery', icon: FiImage },
  { path: '/admin/testimonials', label: 'Testimonials', icon: FiStar },
  { path: '/admin/skills', label: 'Skills', icon: FiBarChart2 },
  { path: '/admin/messages', label: 'Messages', icon: FiMail },
  { path: '/admin/inquiries', label: 'Inquiries', icon: FiMessageCircle },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div className={`h-full flex flex-col bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold">Admin Panel</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin/dashboard" className="w-full flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg transition-all ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} w-full px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all`}>
          <FiLogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg">
        <FiMenu />
      </button>

      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              className="absolute left-0 top-0 h-full w-64">
              <div className="h-full bg-gray-900 text-white relative">
                <button onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-800">
                  <FiX />
                </button>
                {sidebarContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}