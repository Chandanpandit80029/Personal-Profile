import { db } from '../config/firebase';
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc,
  deleteDoc, query, where, orderBy, limit, Timestamp, serverTimestamp
} from 'firebase/firestore';

const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
  throw new Error(`Failed to ${action}: ${error.message}`);
};

export const firestoreService = {
  // Projects
  async getProjects(filters = {}) {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch projects'); }
  },

  async getProject(id) {
    try {
      const docRef = doc(db, 'projects', id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error('Project not found');
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) { handleError(error, 'fetch project'); }
  },

  async addProject(data) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add project'); }
  },

  async updateProject(id, data) {
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) { handleError(error, 'update project'); }
  },

  async deleteProject(id) {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) { handleError(error, 'delete project'); }
  },

  // Blogs
  async getBlogs(filters = {}) {
    try {
      const constraints = [orderBy('publishDate', 'desc')];
      if (filters.category) constraints.unshift(where('category', '==', filters.category));
      if (filters.featured) constraints.unshift(where('featured', '==', true));
      const q = query(collection(db, 'blogs'), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch blogs'); }
  },

  async getBlog(slug) {
    try {
      const q = query(collection(db, 'blogs'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) throw new Error('Blog not found');
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) { handleError(error, 'fetch blog'); }
  },

  async addBlog(data) {
    try {
      const docRef = await addDoc(collection(db, 'blogs'), {
        ...data,
        publishDate: data.publishDate || new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add blog'); }
  },

  async updateBlog(id, data) {
    try {
      await updateDoc(doc(db, 'blogs', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) { handleError(error, 'update blog'); }
  },

  async deleteBlog(id) {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (error) { handleError(error, 'delete blog'); }
  },

  // Services
  async getServices() {
    try {
      const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch services'); }
  },

  async addService(data) {
    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add service'); }
  },

  async updateService(id, data) {
    try {
      await updateDoc(doc(db, 'services', id), { ...data, updatedAt: serverTimestamp() });
    } catch (error) { handleError(error, 'update service'); }
  },

  async deleteService(id) {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) { handleError(error, 'delete service'); }
  },

  // Gallery
  async getGallery() {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch gallery'); }
  },

  async addGalleryImage(data) {
    try {
      const docRef = await addDoc(collection(db, 'gallery'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add gallery image'); }
  },

  async deleteGalleryImage(id) {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (error) { handleError(error, 'delete gallery image'); }
  },

  // Testimonials
  async getTestimonials() {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch testimonials'); }
  },

  async addTestimonial(data) {
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add testimonial'); }
  },

  async updateTestimonial(id, data) {
    try {
      await updateDoc(doc(db, 'testimonials', id), { ...data, updatedAt: serverTimestamp() });
    } catch (error) { handleError(error, 'update testimonial'); }
  },

  async deleteTestimonial(id) {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) { handleError(error, 'delete testimonial'); }
  },

  // Skills
  async getSkills() {
    try {
      const q = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch skills'); }
  },

  async addSkill(data) {
    try {
      const docRef = await addDoc(collection(db, 'skills'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add skill'); }
  },

  async updateSkill(id, data) {
    try {
      await updateDoc(doc(db, 'skills', id), { ...data, updatedAt: serverTimestamp() });
    } catch (error) { handleError(error, 'update skill'); }
  },

  async deleteSkill(id) {
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (error) { handleError(error, 'delete skill'); }
  },

  // Messages
  async getMessages() {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch messages'); }
  },

  async addMessage(data) {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...data,
        read: false,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'send message'); }
  },

  async updateMessage(id, data) {
    try {
      await updateDoc(doc(db, 'messages', id), data);
    } catch (error) { handleError(error, 'update message'); }
  },

  async deleteMessage(id) {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) { handleError(error, 'delete message'); }
  },

  // Inquiries
  async getInquiries() {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { handleError(error, 'fetch inquiries'); }
  },

  async addInquiry(data) {
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'add inquiry'); }
  },

  async updateInquiry(id, data) {
    try {
      await updateDoc(doc(db, 'inquiries', id), data);
    } catch (error) { handleError(error, 'update inquiry'); }
  },

  async deleteInquiry(id) {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) { handleError(error, 'delete inquiry'); }
  },

  // Resume
  async getResume() {
    try {
      const q = query(collection(db, 'resume'), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) { handleError(error, 'fetch resume'); }
  },

  async uploadResume(data) {
    try {
      const existing = await this.getResume();
      if (existing) {
        await updateDoc(doc(db, 'resume', existing.id), { ...data, updatedAt: serverTimestamp() });
        return existing.id;
      }
      const docRef = await addDoc(collection(db, 'resume'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'upload resume'); }
  },

  async deleteResume(id) {
    try {
      await deleteDoc(doc(db, 'resume', id));
    } catch (error) { handleError(error, 'delete resume'); }
  },

  // Settings
  async getSettings() {
    try {
      const q = query(collection(db, 'settings'), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) { handleError(error, 'fetch settings'); }
  },

  async updateSettings(data) {
    try {
      const existing = await this.getSettings();
      if (existing) {
        await updateDoc(doc(db, 'settings', existing.id), { ...data, updatedAt: serverTimestamp() });
        return existing.id;
      }
      const docRef = await addDoc(collection(db, 'settings'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) { handleError(error, 'update settings'); }
  },

  // Social Links
  async getSocialLinks() {
    try {
      const q = query(collection(db, 'socialLinks'), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return [];
      const data = snapshot.docs[0].data();
      return data.links || [];
    } catch (error) { handleError(error, 'fetch social links'); }
  },

  async updateSocialLinks(links) {
    try {
      const q = query(collection(db, 'socialLinks'), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await addDoc(collection(db, 'socialLinks'), { links, createdAt: serverTimestamp() });
      } else {
        await updateDoc(doc(db, 'socialLinks', snapshot.docs[0].id), { links, updatedAt: serverTimestamp() });
      }
    } catch (error) { handleError(error, 'update social links'); }
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const collections = ['projects', 'blogs', 'gallery', 'services', 'testimonials', 'messages'];
      const stats = {};
      for (const col of collections) {
        const snapshot = await getDocs(collection(db, col));
        stats[`total${col.charAt(0).toUpperCase() + col.slice(1)}`] = snapshot.size;
      }
      return stats;
    } catch (error) { handleError(error, 'fetch dashboard stats'); }
  }
};