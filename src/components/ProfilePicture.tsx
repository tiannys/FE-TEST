'use client';

import React, { useRef, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import styles from './ProfilePicture.module.css';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface ProfilePictureProps {
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
}

export default function ProfilePicture({ size = 'medium', editable = false }: ProfilePictureProps) {
  const { profile, updateProfileImage } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      setSizeError(null);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        setSizeError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max allowed: ${MAX_SIZE_MB} MB.`);
        e.target.value = '';
        return;
      }
      setSizeError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.container} ${styles[size]} ${editable ? styles.editable : ''}`}
        onClick={handleClick}
        role={editable ? 'button' : undefined}
        tabIndex={editable ? 0 : undefined}
        onKeyDown={(e) => { if (editable && (e.key === 'Enter' || e.key === ' ')) handleClick(); }}
        title={editable ? `Click to change photo (max ${MAX_SIZE_MB} MB)` : undefined}
      >
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt="Profile"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        {editable && (
          <div className={styles.overlay}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.cameraIcon}>
              <path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2S13.77 8.8 12 8.8 8.8 10.23 8.8 12s1.43 3.2 3.2 3.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z" />
            </svg>
          </div>
        )}
        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className={styles.fileInput}
            aria-label="Upload profile picture"
          />
        )}
      </div>

      {/* Hint & error — only shown on editable large size */}
      {editable && size === 'large' && (
        <div className={styles.hint}>
          {sizeError ? (
            <span className={styles.hintError}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {sizeError}
            </span>
          ) : (
            <span className={styles.hintText}>JPG, PNG, GIF, WebP · Max {MAX_SIZE_MB} MB</span>
          )}
        </div>
      )}
    </div>
  );
}
