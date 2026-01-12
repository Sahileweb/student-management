import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  role: 'admin' | 'student' | null;
  login: (token: string, role: 'admin' | 'student') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'student' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  const login = (newToken: string, newRole: 'admin' | 'student') => {
    if (newRole === 'admin') {
      localStorage.setItem('adminToken', newToken);
      localStorage.removeItem('studentToken');
      navigate('/admin/dashboard');
    } else {
      localStorage.setItem('studentToken', newToken);
      localStorage.removeItem('adminToken');
      navigate('/student/dashboard');
    }

    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    navigate('/');
  };

  
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as 'admin' | 'student' | null;

    if (storedRole === 'admin') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        setToken(adminToken);
        setRole('admin');
      }
    }

    if (storedRole === 'student') {
      const studentToken = localStorage.getItem('studentToken');
      if (studentToken) {
        setToken(studentToken);
        setRole('student');
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
