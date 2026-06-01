import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { FiX, FiZoomIn, FiZoomOut, FiRotateCcw, FiGrid, FiSmartphone, FiTablet, FiMonitor, FiMousePointer, FiCheck, FiRefreshCw, FiCrop } from 'react-icons/fi';
import { getOptimizedUrl } from '../../utils/imageCompressor';

const CROP_PRESETS = [
  { label: 'Free', value: undefined, className: '' },
  { label: '1:1 Square', value: 1 / 1 },
  { label: '16:9 Banner', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '9:16 Mobile', value: 9 / 16 },
  { label: 'Custom', value: 'custom' },
];

export default function ImageCropper({ imageUrl, onComplete, onCancel, aspectRatio: initialAspect }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(initialAspect || undefined);
  const [customWidth, setCustomWidth] = useState(16);
  const [customHeight, setCustomHeight] = useState(9);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 });
  const [showFocalPicker, setShowFocalPicker] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [completed, setCompleted] = useState(false);
  const fileRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;
    setCompleted(true);

    // Create a hidden canvas to perform the actual crop
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    await new Promise((resolve) => {
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const { width: cw, height: ch } = croppedAreaPixels;

        // Apply rotation
        const radians = (rotation * Math.PI) / 180;
        const rotatedW = Math.abs(cw * Math.cos(radians)) + Math.abs(ch * Math.sin(radians));
        const rotatedH = Math.abs(cw * Math.sin(radians)) + Math.abs(ch * Math.cos(radians));

        canvas.width = cw;
        canvas.height = ch;

        ctx.save();
        ctx.translate(cw / 2, ch / 2);
        ctx.rotate(radians);
        ctx.drawImage(
          image,
          croppedAreaPixels.x, croppedAreaPixels.y,
          croppedAreaPixels.width, croppedAreaPixels.height,
          -cw / 2, -ch / 2,
          cw, ch
        );
        ctx.restore();

        canvas.toBlob(async (blob) => {
          if (!blob) return resolve();
          
          onComplete({
            blob,
            cropData: croppedAreaPixels,
            focalPoint,
            zoom,
            rotation,
            aspectRatio: aspect,
            previewUrl: canvas.toDataURL('image/jpeg', 0.9)
          });
          resolve();
        }, 'image/jpeg', 0.9);
      };
    });
  };

  const handleAspectChange = (preset) => {
    if (preset === 'custom') {
      setAspect(customWidth / customHeight);
    } else {
      setAspect(preset);
    }
  };

  const previewSizes = {
    desktop: { width: 1024, height: 700 },
    tablet: { width: 768, height: 900 },
    mobile: { width: 375, height: 600 },
  };

  const previewFrames = {
    desktop: 'w-100 h-auto',
    tablet: 'w-[280px] mx-auto',
    mobile: 'w-[180px] mx-auto',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4" onClick={onCancel}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <FiCrop className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Crop Image</h2>
          </div>
          <button onClick={onCancel} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          {/* Cropper */}
          <div className="lg:col-span-3 relative bg-gray-900 rounded-xl overflow-hidden" style={{ height: 420 }}>
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={false}
              style={{
                containerStyle: { background: '#111' },
                cropAreaStyle: showGrid ? {
                  border: '2px dashed rgba(124, 58, 237, 0.8)',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                } : { border: '2px solid rgba(124, 58, 237, 0.6)' }
              }}
            />

            {/* Crop Grid Toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="absolute top-3 left-3 p-2 bg-black/60 rounded-lg text-white hover:bg-black/80 text-xs flex items-center space-x-1"
            >
              <FiGrid className="w-3.5 h-3.5" />
              <span>{showGrid ? 'Hide' : 'Show'} Grid</span>
            </button>

            {/* Focal Point Picker */}
            <button
              onClick={() => setShowFocalPicker(!showFocalPicker)}
              className={`absolute top-3 right-3 p-2 rounded-lg text-xs flex items-center space-x-1 ${
                showFocalPicker ? 'bg-purple-600 text-white' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <FiMousePointer className="w-3.5 h-3.5" />
              <span>Focus</span>
            </button>

            {/* Focal Point Indicator */}
            {showFocalPicker && (
              <div
                className="absolute w-6 h-6 bg-purple-500/50 border-2 border-purple-400 rounded-full cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
                onClick={(e) => {
                  const rect = e.currentTarget.parentElement.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setFocalPoint({ x: Math.round(x), y: Math.round(y) });
                }}
              />
            )}
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Crop Presets */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Crop Ratio</label>
              <div className="grid grid-cols-2 gap-1.5">
                {CROP_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleAspectChange(preset.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      aspect === preset.value || (preset.value === undefined && aspect === undefined)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              {aspect === (customWidth / customHeight) && (
                <div className="flex space-x-1 mt-1">
                  <input type="number" value={customWidth} onChange={e => { setCustomWidth(+e.target.value); setAspect(+e.target.value / customHeight); }} className="w-full px-2 py-1 text-xs rounded border dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="W" />
                  <span className="self-center text-xs text-gray-500">:</span>
                  <input type="number" value={customHeight} onChange={e => { setCustomHeight(+e.target.value); setAspect(customWidth / +e.target.value); }} className="w-full px-2 py-1 text-xs rounded border dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="H" />
                </div>
              )}
            </div>

            {/* Zoom */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Zoom: {zoom.toFixed(1)}x</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(+e.target.value)}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <button onClick={() => setZoom(Math.max(1, zoom - 0.3))} className="p-1 hover:text-purple-600"><FiZoomOut /></button>
                <button onClick={() => setZoom(Math.min(3, zoom + 0.3))} className="p-1 hover:text-purple-600"><FiZoomIn /></button>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Rotation: {rotation}°</label>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(+e.target.value)}
                className="w-full accent-purple-600"
              />
              <button onClick={() => setRotation(0)} className="flex items-center text-xs text-purple-600 hover:text-purple-700">
                <FiRefreshCw className="w-3 h-3 mr-1" /> Reset
              </button>
            </div>

            {/* Focal Point Display */}
            {showFocalPicker && (
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Focal Point: ({focalPoint.x}%, {focalPoint.y}%)</p>
                <p className="text-xs text-purple-500">Click on image to set focus area</p>
              </div>
            )}

            {/* Preview Mode Toggle */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Preview</label>
              <div className="flex space-x-1">
                {[
                  { mode: 'desktop', icon: FiMonitor },
                  { mode: 'tablet', icon: FiTablet },
                  { mode: 'mobile', icon: FiSmartphone },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`flex-1 p-2 rounded-lg text-xs flex items-center justify-center space-x-1 ${
                      previewMode === mode ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{mode}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="px-4 pb-0">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3 flex items-center justify-center overflow-hidden" style={{ height: 140 }}>
            <div className={`${previewFrames[previewMode]} transition-all duration-300`}>
              <div className="relative w-full" style={{ aspectRatio: aspect || (16 / 9) }}>
                <div
                  className="w-full h-full bg-cover bg-center rounded-lg shadow-md border border-gray-300 dark:border-gray-600"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${focalPoint.x}% ${focalPoint.y}%`,
                    backgroundSize: `${zoom * 100}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div className="absolute inset-0 border-2 border-purple-500/30 rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">
            {previewMode === 'desktop' ? 'Desktop View' : previewMode === 'tablet' ? 'Tablet View' : 'Mobile View'}
            {' — '}Focal: ({focalPoint.x}%, {focalPoint.y}%)
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onCancel} className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            disabled={completed}
            className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {completed ? (
              <><FiCheck className="w-4 h-4" /><span>Applied ✓</span></>
            ) : (
              <><FiCrop className="w-4 h-4" /><span>Apply Crop</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}