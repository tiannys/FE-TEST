'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Contact } from '@/types';
import { contactsApi } from '@/services/api';

interface ContactContextType {
  contacts: Contact[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  fetchContacts: (page?: number, limit?: number, search?: string) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id'>) => Promise<boolean>;
  deleteContact: (id: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async (p: number = 1, limit: number = 20, search?: string) => {
    setLoading(true);
    try {
      const result = await contactsApi.getAll(p, limit, search);
      setContacts(
        result.contacts.map((c: any) => ({
          id: c._id,
          firstName: c.firstName,
          lastName: c.lastName,
          age: c.age,
        }))
      );
      setTotal(result.total);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load contacts on mount
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = useCallback(async (contact: Omit<Contact, 'id'>): Promise<boolean> => {
    try {
      await contactsApi.create({
        firstName: contact.firstName,
        lastName: contact.lastName,
        age: contact.age,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  }, []);

  return (
    <ContactContext.Provider value={{
      contacts, total, page, totalPages, loading,
      fetchContacts, addContact, deleteContact
    }}>
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
