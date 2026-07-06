'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [contactExpanded, setContactExpanded] = useState(
    pathname.startsWith('/contact')
  );

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(
            `https://www.google.com/maps?q=${latitude},${longitude}`,
            '_blank'
          );
        },
        () => {
          window.open('https://www.google.com/maps', '_blank');
        }
      );
    } else {
      window.open('https://www.google.com/maps', '_blank');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuLabel}>{t.sidebar.menu}</div>

        {/* Home */}
        <Link
          href="/"
          className={`${styles.menuItem} ${isActive('/') ? styles.active : ''}`}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className={styles.menuText}>{t.nav.home}</span>
        </Link>

        {/* Contact - collapsible */}
        <button
          className={`${styles.menuItem} ${pathname.startsWith('/contact') ? styles.active : ''}`}
          onClick={() => setContactExpanded(!contactExpanded)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}>
            <path d="M20 0H4v2h16V0zM4 24h16v-2H4v2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9s1.01-2.25 2.25-2.25zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z" />
          </svg>
          <span className={styles.menuText}>{t.nav.contact}</span>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${styles.chevron} ${contactExpanded ? styles.expanded : ''}`}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          </svg>
        </button>

        <div className={`${styles.submenu} ${contactExpanded ? styles.submenuOpen : ''}`}>
          <Link
            href="/contact/list"
            className={`${styles.submenuItem} ${isActive('/contact/list') ? styles.active : ''}`}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.submenuIcon}>
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
            <span>{t.nav.contactList}</span>
          </Link>
          <Link
            href="/contact/create"
            className={`${styles.submenuItem} ${isActive('/contact/create') ? styles.active : ''}`}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.submenuIcon}>
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>{t.nav.contactCreate}</span>
          </Link>
        </div>

        {/* Current Location */}
        <button
          className={styles.menuItem}
          onClick={handleCurrentLocation}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.menuIcon}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className={styles.menuText}>{t.nav.currentLocation}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.externalIcon}>
            <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </button>
      </aside>
    </>
  );
}
