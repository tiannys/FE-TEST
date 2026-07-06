'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContacts } from '@/contexts/ContactContext';
import Modal from '@/components/Modal';
import styles from './page.module.css';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
}

export default function CreateContactPage() {
  const { t } = useLanguage();
  const { addContact } = useContacts();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const validateName = (name: string): boolean => {
    // Allow letters (including Thai) and hyphens only, no spaces
    return /^[a-zA-Z\u0E00-\u0E7F\-]+$/.test(name);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = t.contactForm.validation.firstNameRequired;
    } else if (!validateName(firstName.trim())) {
      newErrors.firstName = t.contactForm.validation.nameInvalid;
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = t.contactForm.validation.lastNameRequired;
    } else if (!validateName(lastName.trim())) {
      newErrors.lastName = t.contactForm.validation.nameInvalid;
    }

    // Age validation
    if (!age.trim()) {
      newErrors.age = t.contactForm.validation.ageRequired;
    } else {
      const ageNum = Number(age);
      if (isNaN(ageNum) || !Number.isInteger(ageNum)) {
        newErrors.age = t.contactForm.validation.ageInvalid;
      } else if (ageNum < 1 || ageNum > 150) {
        newErrors.age = t.contactForm.validation.ageRange;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setShowErrorModal(true);
      return;
    }

    const success = addContact({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: Number(age),
    });

    if (success) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setAge('');
    setErrors({});
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    handleReset();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push('/contact/list')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t.contactForm.backToList}
        </button>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIconWrapper}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.formIcon}>
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h1 className={styles.title}>{t.contactForm.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* First Name */}
          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>
              {t.contactForm.firstName} <span className={styles.required}>*</span>
            </label>
            <input
              id="firstName"
              type="text"
              className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }));
              }}
              placeholder={t.contactForm.firstName}
            />
            {errors.firstName && (
              <span className={styles.error}>{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>
              {t.contactForm.lastName} <span className={styles.required}>*</span>
            </label>
            <input
              id="lastName"
              type="text"
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }));
              }}
              placeholder={t.contactForm.lastName}
            />
            {errors.lastName && (
              <span className={styles.error}>{errors.lastName}</span>
            )}
          </div>

          {/* Age */}
          <div className={styles.field}>
            <label htmlFor="age" className={styles.label}>
              {t.contactForm.age} <span className={styles.required}>*</span>
            </label>
            <input
              id="age"
              type="text"
              inputMode="numeric"
              className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (errors.age) setErrors(prev => ({ ...prev, age: undefined }));
              }}
              placeholder={t.contactForm.age}
            />
            {errors.age && (
              <span className={styles.error}>{errors.age}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button type="submit" className="btn btnPrimary">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {t.contactForm.submit}
            </button>
            <button type="button" className="btn btnSecondary" onClick={handleReset}>
              {t.contactForm.cancel}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        type="success"
        title={t.contactForm.successTitle}
        message={t.contactForm.successMessage}
      >
        <button
          className="btn btnPrimary"
          onClick={() => {
            setShowSuccessModal(false);
            router.push('/contact/list');
          }}
        >
          {t.contactForm.goToList}
        </button>
        <button
          className="btn btnSecondary"
          onClick={handleSuccessClose}
        >
          {t.contactForm.createAnother}
        </button>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        title={t.contactForm.errorTitle}
        message={t.contactForm.errorMessage}
      >
        <button
          className="btn btnSecondary"
          onClick={() => setShowErrorModal(false)}
        >
          {t.contactForm.close}
        </button>
      </Modal>
    </div>
  );
}
