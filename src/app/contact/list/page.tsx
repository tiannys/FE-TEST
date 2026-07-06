'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContacts } from '@/contexts/ContactContext';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function ContactListPage() {
  const { t } = useLanguage();
  const { contacts, deleteContact } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filteredContacts = useMemo(() => {
    if (searchQuery.length < 3) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    // If current page is now empty, go back
    const newTotal = Math.ceil((filteredContacts.length - 1) / pageSize);
    if (currentPage > newTotal && newTotal > 0) {
      setCurrentPage(newTotal);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.contactList.title}</h1>
        <span className={styles.badge}>{filteredContacts.length}</span>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.searchIcon}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t.contactList.search}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchQuery && (
          <button
            className={styles.clearBtn}
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            {t.contactList.clear}
          </button>
        )}
      </div>

      {/* Toolbar: Results Info + Page Size */}
      {filteredContacts.length > 0 && (
        <div className={styles.toolbar}>
          <div className={styles.resultsInfo}>
            {t.contactList.showing} {startIndex + 1} {t.contactList.to}{' '}
            {Math.min(endIndex, filteredContacts.length)} {t.contactList.of}{' '}
            {filteredContacts.length} {t.contactList.entries}
          </div>
          <div className={styles.pageSizeSelector}>
            <label htmlFor="pageSize" className={styles.pageSizeLabel}>
              {t.contactList.perPage}:
            </label>
            <div className={styles.pageSizeBtns}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  className={`${styles.pageSizeBtn} ${pageSize === size ? styles.pageSizeBtnActive : ''}`}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Table / Cards */}
      {currentContacts.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.contactList.name}</th>
                  <th>{t.contactList.age}</th>
                  <th>{t.contactList.actions}</th>
                </tr>
              </thead>
              <tbody>
                {currentContacts.map((contact, index) => (
                  <tr key={contact.id} className={styles.row}>
                    <td className={styles.rowNum}>{startIndex + index + 1}</td>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.avatar}>
                          {contact.firstName.charAt(0)}
                        </div>
                        <span className={styles.contactName}>
                          {contact.firstName} {contact.lastName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.ageBadge}>{contact.age}</span>
                    </td>
                    <td>
                      <button
                        className={`btn btnDanger btnSm`}
                        onClick={() => handleDelete(contact.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                        {t.contactList.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className={styles.cardList}>
            {currentContacts.map((contact, index) => (
              <div key={contact.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardAvatar}>
                    {contact.firstName.charAt(0)}
                  </div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardName}>
                      {contact.firstName} {contact.lastName}
                    </span>
                    <span className={styles.cardAge}>
                      {t.contactList.age}: {contact.age}
                    </span>
                  </div>
                  <span className={styles.cardNum}>#{startIndex + index + 1}</span>
                </div>
                <button
                  className={`btn btnDanger btnSm ${styles.cardDelete}`}
                  onClick={() => handleDelete(contact.id)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  {t.contactList.delete}
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageLabel={t.contactList.page}
            ofLabel={t.contactList.of}
          />
        </>
      ) : (
        <div className={styles.empty}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.emptyIcon}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <p>{t.contactList.noResults}</p>
        </div>
      )}
    </div>
  );
}
