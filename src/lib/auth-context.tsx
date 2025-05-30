'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducerByUsername, verifyProducerPassword } from './producer-store';
import Cookies from 'js-cookie';

interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
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
      // Special case for admin login
      if (username === 'admin' && password === 'admin') {
        const userData = {
          name: 'مدیر سیستم',
          username: 'admin',
          email: 'admin@example.com',
          phone: '0000000000',
          isAdmin: true,
        };
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 1 });
        return true;
      }

      // For producers, verify password using bcrypt
      const isValidPassword = await verifyProducerPassword(username, password);
      if (!isValidPassword) {
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

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
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