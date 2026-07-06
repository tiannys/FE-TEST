'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ email, password, firstName, lastName });
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.langToggle}>
        <button onClick={toggleLanguage} className={styles.langBtn}>
          <span className={styles.langCurrent}>{language === 'en' ? 'EN' : 'TH'}</span>
          <span className={styles.langDivider}>/</span>
          <span className={styles.langTarget}>{language === 'en' ? 'TH' : 'EN'}</span>
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.logoSection}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.logoIcon}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <h1 className={styles.logoText}>ContactApp</h1>
        </div>

        <h2 className={styles.title}>
          {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
        </h2>
        <p className={styles.subtitle}>
          {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <div className={styles.nameRow}>
              <div className={styles.field}>
                <label>{t.auth.firstName}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.auth.firstName}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>{t.auth.lastName}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.auth.lastName}
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label>{t.auth.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label>{t.auth.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              isRegister ? t.auth.register : t.auth.login
            )}
          </button>
        </form>

        <div className={styles.switchMode}>
          <span>{isRegister ? t.auth.hasAccount : t.auth.noAccount}</span>
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? t.auth.loginLink : t.auth.registerLink}
          </button>
        </div>

        <div className={styles.demo}>
          <p>{t.auth.demoAccount}</p>
          <code>admin@contactapp.com / P@ssw0rd</code>
        </div>
      </div>
    </div>
  );
}
