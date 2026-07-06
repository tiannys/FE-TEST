'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useContacts } from '@/contexts/ContactContext';
import ProfilePicture from '@/components/ProfilePicture';
import styles from './page.module.css';

export default function HomePage() {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { contacts } = useContacts();

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <ProfilePicture size="large" editable={true} />
        <h1 className={styles.name}>
          {profile.firstName} {profile.lastName}
        </h1>
        <p className={styles.subtitle}>{t.home.subtitle}</p>
      </div>

      {/* Stats & Quick Actions */}
      <div className={styles.grid}>
        {/* Total Contacts Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{contacts.length}</span>
            <span className={styles.statLabel}>{t.home.totalContacts}</span>
          </div>
        </div>

        {/* View Contacts */}
        <Link href="/contact/list" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
          </div>
          <span className={styles.actionText}>{t.home.viewContacts}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.actionArrow}>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </Link>

        {/* Create Contact */}
        <Link href="/contact/create" className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.actionIconAlt}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className={styles.actionText}>{t.home.createContact}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.actionArrow}>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
