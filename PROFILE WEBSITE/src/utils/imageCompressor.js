const MAX_DIMENSION = 2560;

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

const FALLBACK_IMAGE = '';

export function formatFileSize(bytes) {
  if (!bytes || typeof bytes !== 'number') return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImage(file) {
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return { valid: false, error: 'Only JPG, JPEG, PNG, WEBP & AVIF files are allowed' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Maximum allowed image size is 100MB.' };
  }
  return { valid: true, error: null };
}

export function compressImage(file, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const result = {
      originalFile: file,
      originalSize: file.size,
      originalName: file.name,
      compressedSize: 0,
      compressionRatio: 0,
      compressedBlob: null,
      fileName: file.name.replace(/\.[^/.]+$/, '') + '.jpg'
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height / width) * MAX_DIMENSION);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width / height) * MAX_DIMENSION);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let compressedQuality = quality;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'));
              return;
            }

            result.compressedBlob = blob;
            result.compressedSize = blob.size;
            result.compressionRatio = ((1 - blob.size / file.size) * 100);

            if (blob.size > 1.5 * 1024 * 1024 && compressedQuality > 0.3) {
              compressedQuality -= 0.1;
              canvas.toBlob((lowerBlob) => {
                if (lowerBlob) {
                  result.compressedBlob = lowerBlob;
                  result.compressedSize = lowerBlob.size;
                  result.compressionRatio = ((1 - lowerBlob.size / file.size) * 100);
                }
                resolve(result);
              }, 'image/jpeg', compressedQuality);
            } else {
              resolve(result);
            }
          }, 'image/jpeg', compressedQuality);
        };

        tryCompress();
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Safely extract a plain Cloudinary URL string from any data format.
 * Supports:
 *   - Plain string: "https://res.cloudinary.com/..."
 *   - Object with url field: { url: "https://res.cloudinary.com/..." }
 *   - Object with imageUrl field: { imageUrl: "https://res.cloudinary.com/..." }
 *   - null / undefined / number: returns ''
 */
export function extractImageUrl(image) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (typeof image === 'object') {
    if (typeof image.url === 'string') return image.url;
    if (typeof image.imageUrl === 'string') return image.imageUrl;
    return '';
  }
  return '';
}

/**
 * Safely generate an optimized Cloudinary URL with auto-format, auto-quality, etc.
 * Always returns a string. Never throws. Never crashes.
 */
export function getOptimizedUrl(cloudinaryUrl, options = {}) {
  try {
    // Step 1: Extract a plain URL string from whatever format we received
    const url = extractImageUrl(cloudinaryUrl);
    if (!url) return '';

    // Step 2: Only process Cloudinary URLs
    if (typeof url !== 'string' || !url.includes('cloudinary')) {
      return url;
    }

    // Step 3: Insert transformations
    const transformations = [
      'q_auto',
      'f_auto',
      'dpr_auto',
      'c_limit',
      'w_auto'
    ].join(',');

    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  } catch (error) {
    console.error('Error in getOptimizedUrl:', error, 'Input:', cloudinaryUrl);
    return extractImageUrl(cloudinaryUrl) || FALLBACK_IMAGE;
  }
}

export function getSrcSet(cloudinaryUrl) {
  try {
    const url = extractImageUrl(cloudinaryUrl);
    if (!url || typeof url !== 'string' || !url.includes('cloudinary')) return null;

    const sizes = [320, 640, 960, 1280, 1920, 2560];
    return sizes
      .map(w => {
        const optimizedUrl = url.replace('/image/upload/', `/image/upload/w_${w},q_auto,f_auto/`);
        return `${optimizedUrl} ${w}w`;
      })
      .join(',\n');
  } catch (error) {
    console.error('Error in getSrcSet:', error);
    return null;
  }
}