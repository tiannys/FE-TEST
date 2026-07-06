'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileData } from '@/types';

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  updateProfileImage: (image: string | null) => void;
}

const defaultProfile: ProfileData = {
  firstName: 'John',
  lastName: 'Doe',
  profileImage: null,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('app-profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile({ ...defaultProfile, ...parsed });
      } catch {
        // ignore parse errors
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('app-profile', JSON.stringify(profile));
    }
  }, [profile, mounted]);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const updateProfileImage = (image: string | null) => {
    setProfile(prev => ({ ...prev, profileImage: image }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
