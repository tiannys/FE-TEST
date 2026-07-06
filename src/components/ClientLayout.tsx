'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ContactProvider } from '@/contexts/ContactContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styles from './ClientLayout.module.css';

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Show login page without layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Loading
  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
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
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </AuthProvider>
    </LanguageProvider>
  );
}
