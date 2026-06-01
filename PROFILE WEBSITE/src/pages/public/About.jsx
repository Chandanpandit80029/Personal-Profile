import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiAward, FiBook, FiBriefcase } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import { getOptimizedUrl } from '../../utils/imageCompressor';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, skillsData] = await Promise.all([
          firestoreService.getSettings(),
          firestoreService.getSkills()
        ]);
        setSettings(settingsData);
        setSkills(skillsData);
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-20 bg-white dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  const profilePhoto = settings?.profilePhoto || '';
  const aboutBio = settings?.aboutBio || 'No bio available yet.';
  const education = settings?.education || [];
  const experience = settings?.experience || [];
  const certifications = settings?.certifications || [];

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <img
              src={getOptimizedUrl(profilePhoto)}
              alt="Profile"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">About Me</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{aboutBio}</p>
            <button className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all">
              <FiDownload /><span>Download Resume</span>
            </button>
          </div>
        </motion.div>

        {/* Education & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {education.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"><FiBook className="mr-2 text-purple-600" /> Education</h2>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-l-4 border-purple-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-purple-600">{edu.institution}</p>
                    <p className="text-gray-500 text-sm">{edu.year}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {experience.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"><FiBriefcase className="mr-2 text-purple-600" /> Experience</h2>
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-l-4 border-pink-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                    <p className="text-pink-600">{exp.company} | {exp.period}</p>
                    <p className="text-gray-500 text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, i) => (
                <motion.div key={skill.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                    <span className="text-purple-600 font-bold">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${skill.percentage}%` }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center"><FiAward className="mr-2 text-purple-600" /> Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
                  <FiAward className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                  <p className="text-gray-500 text-sm">{cert.issuer} - {cert.year}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}