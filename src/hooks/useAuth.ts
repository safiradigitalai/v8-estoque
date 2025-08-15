'use client';

import { useState, useEffect } from 'react';

interface AuthSession {
  user: string;
  timestamp: number;
  expires: number;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const sessionData = localStorage.getItem('v8_auth_session');
      
      if (sessionData) {
        const session: AuthSession = JSON.parse(sessionData);
        const now = Date.now();
        
        // Verificar se a sessão ainda é válida
        if (now < session.expires) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          // Sessão expirou
          logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (username: string) => {
    const session: AuthSession = {
      user: username,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };

    localStorage.setItem('v8_auth_session', JSON.stringify(session));
    setIsAuthenticated(true);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem('v8_auth_session');
    setIsAuthenticated(false);
    setUser(null);
  };

  const extendSession = () => {
    if (isAuthenticated && user) {
      const session: AuthSession = {
        user,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // Estender por mais 24h
      };
      localStorage.setItem('v8_auth_session', JSON.stringify(session));
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    extendSession
  };
}