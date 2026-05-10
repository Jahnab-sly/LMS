/**
 * Authentication context using Express backend
 * Replaces Supabase auth with custom backend authentication
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, LoginResponse } from './api';

interface User {
  username: string;
  userId?: string;
  name?: string;
  role: 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'student' | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response: LoginResponse = await api.auth.login(username, password);
      
      if (!response.success || !response.user) {
        throw new Error(response.message || 'Login failed');
      }

      const userData: User = {
        username: response.user.username,
        userId: response.user.userId,
        name: response.user.name,
        role: response.role as 'admin' | 'student',
      };

      setUser(userData);
      setRole(response.role as 'admin' | 'student');
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem('user');
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
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
