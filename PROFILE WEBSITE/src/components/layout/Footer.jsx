import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiHeart } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, socialLinksData] = await Promise.all([
          firestoreService.getSettings(),
          firestoreService.getSocialLinks()
        ]);
        setSettings(settingsData);
        if (socialLinksData && socialLinksData.length > 0) {
          setSocialLinks(socialLinksData);
        }
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    };
    fetchData();
  }, []);

  const icons = [FiGithub, FiLinkedin, FiTwitter, FiInstagram];
  const name = settings?.name || 'John Doe';
  const email = settings?.email || 'john@example.com';
  const phone = settings?.phone || '+1 (555) 123-4567';
  const location = settings?.location || 'San Francisco, CA';
  const bio = settings?.bio || 'Full-stack developer passionate about creating beautiful, functional web applications that make a difference.';

  const links = socialLinks.length > 0 ? socialLinks : [
    { platform: 'GitHub', url: '#', icon: 'FiGithub' },
    { platform: 'LinkedIn', url: '#', icon: 'FiLinkedin' },
    { platform: 'Twitter', url: '#', icon: 'FiTwitter' },
    { platform: 'Instagram', url: '#', icon: 'FiInstagram' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
              </div>
              <span className="text-xl font-bold">{name}</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              {bio}
            </p>
            <div className="flex space-x-3">
              {links.map((social, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <a
                    key={index}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label={social.platform || `Social ${index}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About' },
                { path: '/portfolio', label: 'Portfolio' },
                { path: '/services', label: 'Services' },
                { path: '/blog', label: 'Blog' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{location}</li>
              <li>{email}</li>
              <li>{phone}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            © {new Date().getFullYear()} {name}. Made with <FiHeart className="mx-1 text-red-500" /> using React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}