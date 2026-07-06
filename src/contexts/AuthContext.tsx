'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, usersApi } from '@/services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token and load user
    const token = localStorage.getItem('auth-token');
    const savedUser = localStorage.getItem('auth-user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Refresh profile from API
        usersApi.getProfile().then((profile) => {
          const userData: User = {
            id: profile._id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileImage: profile.profileImage,
            role: profile.role,
          };
          setUser(userData);
          localStorage.setItem('auth-user', JSON.stringify(userData));
        }).catch(() => {
          // Token invalid, clear
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
          setUser(null);
        });
      } catch {
        localStorage.removeItem('auth-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    localStorage.setItem('auth-token', result.access_token);
    localStorage.setItem('auth-user', JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const result = await authApi.register(data);
    localStorage.setItem('auth-token', result.access_token);
    localStorage.setItem('auth-user', JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('auth-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
