'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducerByUsername, verifyProducerPassword } from './producer-store';
import { getAdminByUsername, verifyAdminPassword } from './admin-store'; // New import
import Cookies from 'js-cookie';
import type { User } from '@/types'; // Import User from types

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  updateProfile: (updatedUser: Partial<User>) => void; // Added updateProfile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in cookies
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Handle admin login using admin-store
      if (username === 'admin') {
        const isValidAdminPassword = await verifyAdminPassword(username, password);
        if (isValidAdminPassword) {
          const adminUser = await getAdminByUsername(username);
          if (adminUser) {
            const userData: User = {
              name: adminUser.name,
              username: adminUser.username,
              email: adminUser.email,
              phone: adminUser.phone,
              isAdmin: true,
              profilePictureUrl: adminUser.profilePictureUrl,
            };
            setUser(userData);
            Cookies.set('user', JSON.stringify(userData), { expires: 1 });
            return true;
          }
        }
        return false; // Admin login failed
      }

      // For producers, verify password
      const isValidProducerPassword = await verifyProducerPassword(username, password);
      if (!isValidProducerPassword) {
        return false;
      }

      const producer = await getProducerByUsername(username);
      if (!producer) {
        return false;
      }

      const userData = {
        name: producer.name,
        username: producer.username,
        email: producer.email,
        phone: producer.phone,
        isAdmin: producer.isAdmin || false,
      };
      setUser(userData);
      Cookies.set('user', JSON.stringify(userData), { expires: 1 });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedUser };
        Cookies.set('user', JSON.stringify(newUser), { expires: 1 });
        return newUser;
      }
      return null;
    });
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
