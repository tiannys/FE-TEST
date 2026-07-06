'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileData } from '@/types';
import { useAuth } from './AuthContext';
import { usersApi } from '@/services/api';

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  updateProfileImage: (image: string | null) => void;
}

const defaultProfile: ProfileData = {
  firstName: '',
  lastName: '',
  profileImage: null,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profileImage: user?.profileImage || null,
  });

  // Sync from auth user
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      });
    }
  }, [user]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
    try {
      const apiData: { firstName?: string; lastName?: string; profileImage?: string } = {};
      if (data.firstName !== undefined) apiData.firstName = data.firstName;
      if (data.lastName !== undefined) apiData.lastName = data.lastName;
      if (data.profileImage !== undefined && data.profileImage !== null) apiData.profileImage = data.profileImage;
      await usersApi.updateProfile(apiData);
      updateUser(data as any);
    } catch {
      // Revert on error
    }
  };

  const updateProfileImage = async (image: string | null) => {
    const previous = profile.profileImage;
    setProfile(prev => ({ ...prev, profileImage: image }));
    try {
      await usersApi.updateProfile({ profileImage: image || undefined });
      updateUser({ profileImage: image } as any);
    } catch (err) {
      // Revert on error so UI stays consistent with DB
      setProfile(prev => ({ ...prev, profileImage: previous }));
      console.error('Failed to save profile image:', err);
      alert('Failed to save profile image. Please try again.');
    }
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
