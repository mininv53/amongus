import React, { useRef, useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Music, X } from 'lucide-react';
import { useLanguage } from '../i18n';

export const DropzoneUpload = ({ type = 'image', onFileSelect, disabled = false }) => {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const accept = type === 'image'
    ? 'image/jpeg,image/png,image/webp'
    : 'audio/mpeg,audio/wav,audio/ogg,audio/flac';

  const handleFile = useCallback((selectedFile) => {
    setFile(selectedFile);
    if (type === 'image' && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
    if (onFileSelect) onFileSelect(selectedFile);
  }, [type, onFileSelect]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (onFileSelect) onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full" data-testid="analyzer-dropzone">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        data-testid={`file-input-${type}`}
      />

      {file ? (
        <div className="border border-border rounded-xl p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'image' && preview ? (
                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              disabled={disabled}
              data-testid="clear-file-button"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors overflow-hidden ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-card/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {/* Scanner sheen */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="scanner-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          </div>

          <div className="relative flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {type === 'image' ? (
                <ImageIcon className="w-5 h-5 text-primary" />
              ) : (
                <Music className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {type === 'image' ? t('upload_image_text') : t('upload_audio_text')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {type === 'image' ? t('upload_image_hint') : t('upload_audio_hint')}
              </p>
            </div>
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneUpload;
