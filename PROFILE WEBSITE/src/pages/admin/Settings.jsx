import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import { firestoreService } from '../../services/firestoreService';
import ImageUpload from '../../components/common/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', title: '', bio: '',
    email: '', phone: '', location: '',
    profilePhoto: '', aboutBio: '',
    education: [{ degree: '', institution: '', year: '' }],
    experience: [{ role: '', company: '', period: '', description: '' }],
    certifications: [{ name: '', issuer: '', year: '' }]
  });

  const fetchSettings = async () => {
    try {
      const data = await firestoreService.getSettings();
      if (data) {
        setForm({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          profilePhoto: data.profilePhoto || '',
          aboutBio: data.aboutBio || '',
          education: data.education || [{ degree: '', institution: '', year: '' }],
          experience: data.experience || [{ role: '', company: '', period: '', description: '' }],
          certifications: data.certifications || [{ name: '', issuer: '', year: '' }]
        });
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanedData = {
        ...form,
        education: form.education.filter(e => e.degree || e.institution),
        experience: form.experience.filter(e => e.role || e.company),
        certifications: form.certifications.filter(c => c.name || c.issuer)
      };
      await firestoreService.updateSettings(cleanedData);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field, template) => setForm({ ...form, [field]: [...form[field], template] });
  const removeArrayItem = (field, index) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  const updateArrayItem = (field, index, key, value) => {
    const items = [...form[field]];
    items[index] = { ...items[index], [key]: value };
    setForm({ ...form, [field]: items });
  };

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>;
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows="3"
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Bio</label>
              <textarea value={form.aboutBio} onChange={e => setForm({ ...form, aboutBio: e.target.value })} rows="4"
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo</label>
              <ImageUpload
                currentUrl={form.profilePhoto}
                onUpload={(url) => setForm({ ...form, profilePhoto: url })}
                onRemove={() => setForm({ ...form, profilePhoto: '' })}
                folder="profile"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
            <button type="button" onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">+ Add</button>
          </div>
          {form.education.map((edu, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <input value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} placeholder="Degree" className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} placeholder="Institution" className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} placeholder="Year" className="w-24 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              {form.education.length > 1 && <button type="button" onClick={() => removeArrayItem('education', i)} className="px-2 py-2 text-red-500 hover:bg-red-50 rounded">X</button>}
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
            <button type="button" onClick={() => addArrayItem('experience', { role: '', company: '', period: '', description: '' })}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">+ Add</button>
          </div>
          {form.experience.map((exp, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <input value={exp.role} onChange={e => updateArrayItem('experience', i, 'role', e.target.value)} placeholder="Role" className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input value={exp.company} onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} placeholder="Company" className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input value={exp.period} onChange={e => updateArrayItem('experience', i, 'period', e.target.value)} placeholder="Period" className="w-28 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              {form.experience.length > 1 && <button type="button" onClick={() => removeArrayItem('experience', i)} className="px-2 py-2 text-red-500 hover:bg-red-50 rounded">X</button>}
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Certifications</h2>
            <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuer: '', year: '' })}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">+ Add</button>
          </div>
          {form.certifications.map((cert, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <input value={cert.name} onChange={e => updateArrayItem('certifications', i, 'name', e.target.value)} placeholder="Name" className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input value={cert.issuer} onChange={e => updateArrayItem('certifications', i, 'issuer', e.target.value)} placeholder="Issuer" className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <input value={cert.year} onChange={e => updateArrayItem('certifications', i, 'year', e.target.value)} placeholder="Year" className="w-24 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              {form.certifications.length > 1 && <button type="button" onClick={() => removeArrayItem('certifications', i)} className="px-2 py-2 text-red-500 hover:bg-red-50 rounded">X</button>}
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50">
          <FiSave /><span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
}