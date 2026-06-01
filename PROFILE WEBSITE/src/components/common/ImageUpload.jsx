import { useState, useRef, useCallback } from 'react';
import { FiUpload, FiX, FiCamera, FiImage, FiTrash2, FiCheckCircle, FiCrop } from 'react-icons/fi';
import { uploadToCloudinary } from '../../config/cloudinary';
import ImageCropper from './ImageCropper';
import { validateImage, compressImage, formatFileSize, SUPPORTED_FORMATS } from '../../utils/imageCompressor';

export default function ImageUpload({ onUpload, currentUrl, folder = 'profile-website', onRemove, aspectRatio }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | crop | compressing | uploading | done
  const [showCropper, setShowCropper] = useState(false);
  const [rawFileUrl, setRawFileUrl] = useState(null);
  const fileInputRef = useRef(null);
  const originalFileRef = useRef(null);

  const processAndUpload = async (file) => {
    // Validate
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    originalFileRef.current = file;

    // Create local preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawFileUrl(e.target.result);
      setPreview(e.target.result);
      setShowCropper(true);
      setStatus('crop');
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (cropResult) => {
    setShowCropper(false);
    setStatus('compressing');
    setPreview(cropResult.previewUrl);

    try {
      // Compress the cropped blob
      const compressed = await compressImage(new File([cropResult.blob], originalFileRef.current.name));
      setCompressionInfo({
        originalSize: originalFileRef.current.size,
        compressedSize: compressed.compressedSize,
        ratio: compressed.compressionRatio
      });

      // Upload the cropped+compressed blob
      setStatus('uploading');
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 12, 85));
      }, 300);

      const result = await uploadToCloudinary(compressed.compressedBlob || cropResult.blob, folder);
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('done');

      // Pass the plain URL to onUpload for backward compatibility
      if (onUpload) {
        onUpload(result.secure_url);
      }
      // Pass crop data via onCropData if provided
      if (onUpload?.cropDataCallback) {
        onUpload.cropDataCallback({
          cropData: cropResult.cropData,
          focalPoint: cropResult.focalPoint,
          zoom: cropResult.zoom,
          rotation: cropResult.rotation
        });
      }
      setPreview(result.secure_url);

      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
        setCompressionInfo(null);
      }, 2000);
    } catch (err) {
      setStatus('idle');
      setError('Image upload failed. Please try again.');
      setPreview(null);
    }
  };

  const handleUploadCancel = () => {
    setShowCropper(false);
    setStatus('idle');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processAndUpload(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processAndUpload(file);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setCompressionInfo(null);
    setStatus('idle');
    setRawFileUrl(null);
    originalFileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onRemove) onRemove();
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const fileName = originalFileRef.current?.name || '';

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all text-center ${
          dragOver
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : preview
            ? 'border-transparent'
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Compression/Upload Progress */}
        {(status === 'compressing' || status === 'uploading') && (
          <div className="py-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {status === 'compressing' ? (
                <>
                  <FiImage className="w-5 h-5 text-purple-600 animate-pulse" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compressing...</span>
                </>
              ) : (
                <>
                  <FiUpload className="w-5 h-5 text-purple-600 animate-bounce" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                </>
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {compressionInfo && compressionInfo.compressedSize > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  Original: {formatFileSize(compressionInfo.originalSize)}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  Compressed: {formatFileSize(compressionInfo.compressedSize)}
                  {' '}({compressionInfo.ratio.toFixed(1)}% smaller)
                </p>
              </div>
            )}
            {progress > 0 && (
              <p className="text-xs text-gray-500 mt-1">{progress}%</p>
            )}
          </div>
        )}

        {/* Done State */}
        {status === 'done' && (
          <div className="py-6 text-center">
            <FiCheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
            <p className="text-sm text-green-600 font-medium">Upload Complete!</p>
            {compressionInfo && (
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(compressionInfo.originalSize)} → {formatFileSize(compressionInfo.compressedSize)}
                {' '}({compressionInfo.ratio.toFixed(1)}% saved)
              </p>
            )}
          </div>
        )}

        {/* Preview with hover overlay */}
        {status === 'idle' && preview && (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors"
                title="Replace image"
              >
                <FiImage className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
            {compressionInfo && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Compressed: {formatFileSize(compressionInfo.compressedSize)}
              </div>
            )}
            {fileName && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded truncate max-w-[80%]">
                {fileName}
              </div>
            )}
          </div>
        )}

        {/* Initial Upload State */}
        {status === 'idle' && !preview && (
          <div className="py-6">
            <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, JPEG, PNG, WEBP, AVIF (up to 100MB)
            </p>
            <p className="text-xs text-gray-400">
              Images over 2560px will be auto-resized
            </p>
            <div className="flex justify-center space-x-2 mt-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors flex items-center space-x-1"
              >
                <FiImage className="w-3 h-3" />
                <span>Browse Files</span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleCameraCapture(); }}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
              >
                <FiCamera className="w-3 h-3" />
                <span>Camera</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <span className="mr-1">⚠</span> {error}
        </p>
      )}

      {/* Image Cropper Modal */}
      {showCropper && rawFileUrl && (
        <ImageCropper
          imageUrl={rawFileUrl}
          onComplete={handleCropComplete}
          onCancel={handleUploadCancel}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
}

export function MultiImageUpload({ images, onImagesChange, folder = 'profile-website', maxImages = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const uploadFiles = async (files) => {
    const newImages = [...images];

    for (const file of Array.from(files)) {
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error);
        continue;
      }
      if (newImages.length >= maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        break;
      }

      setUploading(true);
      setStatusText(`Processing: ${file.name}`);
      setProgress(0);
      setError(null);

      try {
        // Compress
        const compressed = await compressImage(file);
        setCompressionInfo({
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          ratio: compressed.compressionRatio
        });

        // Upload
        setStatusText(`Uploading: ${file.name}`);
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 85));
        }, 300);

        const result = await uploadToCloudinary(compressed.compressedBlob || file, folder);
        clearInterval(progressInterval);
        newImages.push(result.secure_url);
        setProgress(100);
        setTimeout(() => setProgress(0), 300);
      } catch (err) {
        console.error('Upload failed:', err);
        setError(`Failed: ${file.name}`);
      }
    }

    setUploading(false);
    setStatusText('');
    setCompressionInfo(null);
    onImagesChange(newImages);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && images.length < maxImages && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : images.length >= maxImages
            ? 'border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{statusText}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            {compressionInfo && compressionInfo.compressedSize > 0 && (
              <p className="text-xs text-green-600">
                {formatFileSize(compressionInfo.originalSize)} → {formatFileSize(compressionInfo.compressedSize)}
                {' '}({compressionInfo.ratio.toFixed(1)}% saved)
              </p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">{progress}%</p>
          </div>
        ) : (
          <div>
            <FiUpload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <p className="text-sm text-gray-500">
              {images.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : 'Click or drag & drop to add images'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {images.length}/{maxImages} uploaded — Auto-compressed & resized
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}