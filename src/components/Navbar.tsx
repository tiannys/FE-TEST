'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ProfilePicture from './ProfilePicture';
import styles from './Navbar.module.css';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button
          className={`${styles.hamburger} ${isSidebarOpen ? styles.active : ''}`}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
        <Link href="/" className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.logoIcon}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span className={styles.logoText}>ContactApp</span>
        </Link>
      </div>

      <div className={styles.right}>
        <button
          className={styles.langToggle}
          onClick={toggleLanguage}
          aria-label={`Switch to ${language === 'en' ? 'Thai' : 'English'}`}
        >
          <span className={styles.langCurrent}>
            {language === 'en' ? 'EN' : 'TH'}
          </span>
          <span className={styles.langDivider}>/</span>
          <span className={styles.langTarget}>
            {language === 'en' ? 'TH' : 'EN'}
          </span>
        </button>

        <div className={styles.profileSection}>
          <ProfilePicture size="small" editable={true} />
          <span className={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout} title={t.nav.logout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.logoutIcon}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
