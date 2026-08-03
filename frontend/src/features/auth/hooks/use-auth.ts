import { UserProfile } from '@/types';
import { useEffect, useState } from 'react';
import { getAuthToken, getAuthUser } from '../services/auth-storage';

export interface UseAuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Hook to manage authentication state
 * Retrieves stored token and user data on mount and provides auth status
 */
export function useAuth(): UseAuthState {
  const [state, setState] = useState<UseAuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const token = await getAuthToken();
        const user = await getAuthUser();
        
        setState({
          token: token ?? null,
          user: user ?? null,
          isAuthenticated: token != null && user != null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching auth data:', error);
        setState({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    fetchAuthData();
  }, []);

  return state;
}
