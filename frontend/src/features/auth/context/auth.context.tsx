import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { getAuthToken, getAuthUser, saveAuthToken, saveAuthUser, removeAuthToken } from '../services/auth-storage';

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await getAuthToken();
        const storedUser = await getAuthUser();
        
        setTokenState(storedToken);
        setUserState(storedUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    if (newUser) {
      saveAuthUser(newUser).catch(error => 
        console.error('Error saving user:', error)
      );
    }
  };

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      saveAuthToken(newToken).catch(error => 
        console.error('Error saving token:', error)
      );
    }
  };

  const logout = async () => {
    try {
      setUserState(null);
      setTokenState(null);
      await removeAuthToken();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refresh = async () => {
    try {
      const storedToken = await getAuthToken();
      const storedUser = await getAuthUser();
      
      setTokenState(storedToken);
      setUserState(storedUser);
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: token !== null && user !== null,
    isLoading,
    setUser,
    setToken,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}