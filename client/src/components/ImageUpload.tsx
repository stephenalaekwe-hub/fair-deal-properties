'use client';

import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  placeholder?: string;
}

export default function ImageUpload({
  label = 'Upload Photo',
  value = '',
  onChange,
  helperText = 'Pictures only (JPG, PNG, WebP) · Max 15MB. Videos are strictly prohibited.',
  placeholder = 'Select or drop an image file...',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');

    // Strict client-side check: Block any video format
    if (file.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|m4v|3gp)$/i.test(file.name)) {
      setError('❌ Video files are not permitted. Only high-resolution pictures/photographs (PNG, JPG, WebP) are accepted.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('❌ Invalid file format. Please upload an image file (PNG, JPG, WebP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('❌ Image file exceeds 15MB limit. Please select a smaller photo.');
      return;
    }

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: fd,
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error || 'Failed to upload photo.');
        return;
      }

      const uploadedUrl = json.data.url;
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error during picture upload. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      <div
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '16px',
          background: '#f8fafc',
          textAlign: 'center',
          transition: 'border-color 0.2s',
          position: 'relative',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          style={{ display: 'none' }}
          id="photo-upload-input"
        />

        {preview ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <img
              src={preview}
              alt="Uploaded evidence preview"
              style={{
                width: '72px',
                height: '72px',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--forest)', wordBreak: 'break-all' }}>
                ✓ Picture uploaded successfully
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                {preview}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Replace photo
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📸</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              {uploading ? 'Uploading picture to document vault...' : placeholder}
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 12px 0' }}>
              {helperText}
            </p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '7px 16px',
                background: 'var(--forest)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              {uploading ? 'Uploading…' : 'Select Photo from Device'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#b91c1c', fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  );
}
