export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'profile_upload',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || ''
};

export const uploadToCloudinary = async (file, folder = 'profile-website') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  // Note: For client-side deletion, you'd typically use a cloud function
  // This is a placeholder - implement via Firebase Cloud Functions for production
  console.log('Delete requested for:', publicId);
  return { success: true };
};

export const getOptimizedUrl = (publicId, options = {}) => {
  const { width = 500, height = 500, crop = 'fill', quality = 'auto', f_auto = true } = options;
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/c_${crop},w_${width},h_${height},q_${quality}${f_auto ? ',f_auto' : ''}/v1/${publicId}`;
};