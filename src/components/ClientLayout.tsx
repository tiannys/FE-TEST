'use client';

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ContactProvider } from '@/contexts/ContactContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styles from './ClientLayout.module.css';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <LanguageProvider>
      <ProfileProvider>
        <ContactProvider>
          <div className={styles.layout}>
            <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
            <div className={styles.body}>
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
              <main className={`${styles.main} ${sidebarOpen && !isMobile ? styles.shifted : ''}`}>
                <div className={styles.content}>
                  {children}
                </div>
                <Footer />
              </main>
            </div>
          </div>
        </ContactProvider>
      </ProfileProvider>
    </LanguageProvider>
  );
}
