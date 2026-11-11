'use client';

import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

export function parseImageUrls(val?: string | string[] | null): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((u) => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((u) => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
        }
      } catch {
        // fall through
      }
    }
    if (trimmed.includes('\n')) {
      return trimmed
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [trimmed];
  }
  return [];
}

export function serializeImageUrls(urls: string[]): string {
  const clean = urls.map((u) => u.trim()).filter(Boolean);
  if (clean.length === 0) return '';
  if (clean.length === 1) return clean[0];
  return JSON.stringify(clean);
}

interface PhotoItem {
  url: string;
  name?: string;
  size?: string;
}

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  placeholder?: string;
}

export default function ImageUpload({
  label = 'Upload Photo(s)',
  value = '',
  onChange,
  helperText = 'Pictures only (JPG, PNG, WebP) · Max 15MB per photo. You can add one or multiple photos. Videos are strictly prohibited.',
  placeholder = 'Select or drop one or multiple image files...',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [items, setItems] = useState<PhotoItem[]>(() =>
    parseImageUrls(value).map((url) => ({ url }))
  );

  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const incomingUrls = parseImageUrls(value);
    setItems((prev) => {
      const prevUrls = prev.map((p) => p.url);
      if (
        prevUrls.length === incomingUrls.length &&
        prevUrls.every((u, idx) => u === incomingUrls[idx])
      ) {
        return prev;
      }
      return incomingUrls.map((url) => {
        const existing = prev.find((p) => p.url === url);
        return existing || { url };
      });
    });
  }, [value]);

  const validateAndUploadSingleFile = async (file: File): Promise<PhotoItem | null> => {
    if (
      file.type.startsWith('video/') ||
      /\.(mp4|mov|avi|mkv|webm|m4v|3gp|wmv|flv)$/i.test(file.name)
    ) {
      setError(
        '❌ Video files cannot be accepted. Nigerian cadastral and inspection procedures require verified still photographs (PNG, JPG, WebP) of the site, boundary beacons, or survey plan.'
      );
      return null;
    }

    if (!file.type.startsWith('image/')) {
      setError('❌ Invalid file format. Please upload an image file (PNG, JPG, WebP).');
      return null;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError(`❌ "${file.name}" exceeds the 15MB limit. Please select a smaller photo.`);
      return null;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: fd,
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      setError(json.error || `Failed to upload "${file.name}".`);
      return null;
    }

    return {
      url: json.data.url,
      name: file.name,
      size: formattedSize,
    };
  };

  const handleAddFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setError('');
    setUploading(true);

    try {
      const newlyUploaded: PhotoItem[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadStatus(
          files.length > 1
            ? `Uploading photo ${i + 1} of ${files.length}...`
            : 'Uploading picture to document vault...'
        );
        const uploaded = await validateAndUploadSingleFile(files[i]);
        if (uploaded) {
          newlyUploaded.push(uploaded);
        }
      }

      if (newlyUploaded.length > 0) {
        const nextItems = [...items, ...newlyUploaded];
        setItems(nextItems);
        onChange(serializeImageUrls(nextItems.map((item) => item.url)));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error during picture upload. Please check your connection.');
    } finally {
      setUploading(false);
      setUploadStatus('');
      if (addInputRef.current) addInputRef.current.value = '';
    }
  };

  const handleReplaceFile = async (file: File) => {
    const targetIdx = replaceIndexRef.current;
    if (targetIdx === null || targetIdx < 0 || targetIdx >= items.length) return;

    setError('');
    setUploading(true);
    setUploadStatus(`Replacing photo #${targetIdx + 1}...`);

    try {
      const uploaded = await validateAndUploadSingleFile(file);
      if (uploaded) {
        const nextItems = items.map((item, idx) => (idx === targetIdx ? uploaded : item));
        setItems(nextItems);
        onChange(serializeImageUrls(nextItems.map((item) => item.url)));
      }
    } catch (err) {
      console.error('Replace upload error:', err);
      setError('Network error during picture replacement. Please check your connection.');
    } finally {
      setUploading(false);
      setUploadStatus('');
      replaceIndexRef.current = null;
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleRemoveIndex = (idxToRemove: number) => {
    const nextItems = items.filter((_, idx) => idx !== idxToRemove);
    setItems(nextItems);
    onChange(serializeImageUrls(nextItems.map((item) => item.url)));
    setError('');
  };

  const handleClearAll = () => {
    setItems([]);
    onChange('');
    setError('');
    if (addInputRef.current) addInputRef.current.value = '';
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            void handleAddFiles(e.dataTransfer.files);
          }
        }}
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '14px',
          background: '#f8fafc',
          transition: 'border-color 0.2s',
          position: 'relative',
        }}
      >
        {/* Hidden input for adding one or multiple photos */}
        <input
          ref={addInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              void handleAddFiles(e.target.files);
            }
          }}
          style={{ display: 'none' }}
        />

        {/* Hidden input for replacing a single specific photo */}
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleReplaceFile(f);
          }}
          style={{ display: 'none' }}
        />

        {items.length > 0 ? (
          <div>
            {/* Top summary & Add More action bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--forest)' }}>
                ✓ {items.length} {items.length === 1 ? 'Photograph' : 'Photographs'} attached
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => addInputRef.current?.click()}
                  style={{
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    background: 'var(--forest)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>+</span>
                  <span>{uploading ? 'Uploading…' : 'Add Photo(s)'}</span>
                </button>
                {items.length > 1 && (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleClearAll}
                    style={{
                      padding: '5px 10px',
                      fontSize: '11px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Remove All
                  </button>
                )}
              </div>
            </div>

            {/* List of attached photos */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '240px',
                overflowY: 'auto',
                paddingRight: '2px',
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={`${idx}-${item.url.slice(0, 36)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 10px',
                  }}
                >
                  <img
                    src={item.url}
                    alt={`Attached evidence photo ${idx + 1}`}
                    onClick={() => setPreviewIndex(idx)}
                    title="Click to view full-size photo"
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      border: '1px solid #cbd5e1',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                      Photo #{idx + 1}
                    </div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: '#64748b',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '220px',
                        }}
                      >
                        {item.name ||
                          (item.url.startsWith('data:')
                            ? `Site survey evidence photo #${idx + 1}`
                            : item.url)}
                      </span>
                      {item.size && (
                        <span style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }}>
                          ({item.size})
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setPreviewIndex(idx)}
                      style={{
                        padding: '4px 9px',
                        fontSize: '11px',
                        background: '#dcfce7',
                        color: '#15803d',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => {
                        replaceIndexRef.current = idx;
                        replaceInputRef.current?.click();
                      }}
                      style={{
                        padding: '4px 9px',
                        fontSize: '11px',
                        background: '#e2e8f0',
                        color: '#334155',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => handleRemoveIndex(idx)}
                      style={{
                        padding: '4px 9px',
                        fontSize: '11px',
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom button to easily add another photo */}
            <button
              type="button"
              disabled={uploading}
              onClick={() => addInputRef.current?.click()}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '8px 12px',
                background: '#ecfdf5',
                color: 'var(--forest)',
                border: '1px dashed #10b981',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>📸</span>
              <span>
                {uploading
                  ? uploadStatus || 'Uploading photo(s)...'
                  : '+ Add Another Photo (or Select Multiple)'}
              </span>
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📸</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              {uploading ? uploadStatus || 'Uploading picture to document vault...' : placeholder}
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 12px 0' }}>{helperText}</p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => addInputRef.current?.click()}
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
              {uploading ? 'Uploading…' : 'Select Photo(s) from Device'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#b91c1c', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Lightbox modal for viewing attached photos */}
      {previewIndex !== null && items[previewIndex] && (
        <div
          onClick={() => setPreviewIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--forest)',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                Photograph #{previewIndex + 1} of {items.length}
              </div>
              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>
            <div
              style={{
                padding: '16px',
                background: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto',
              }}
            >
              <img
                src={items[previewIndex].url}
                alt={`Preview ${previewIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  background: '#ffffff',
                }}
              />
              {items.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewIndex((previewIndex - 1 + items.length) % items.length)}
                    style={{
                      padding: '5px 12px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ← Prev
                  </button>
                  <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600 }}>
                    {previewIndex + 1} / {items.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewIndex((previewIndex + 1) % items.length)}
                    style={{
                      padding: '5px 12px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
