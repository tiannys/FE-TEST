'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Contact } from '@/types';
import { generateContacts } from '@/utils/generateContacts';

interface ContactContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => boolean;
  deleteContact: (id: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('app-contacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setContacts(parsed);
        } else {
          setContacts(generateContacts(100));
        }
      } catch {
        setContacts(generateContacts(100));
      }
    } else {
      setContacts(generateContacts(100));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('app-contacts', JSON.stringify(contacts));
    }
  }, [contacts, mounted]);

  const addContact = useCallback((contact: Omit<Contact, 'id'>): boolean => {
    try {
      const newContact: Contact = {
        ...contact,
        id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };
      setContacts(prev => [newContact, ...prev]);
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, addContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}
