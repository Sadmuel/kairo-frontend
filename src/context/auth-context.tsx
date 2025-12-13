import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { authService, tokenStore } from '@/services';
import type { User, LoginDto, RegisterDto } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Try to restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = tokenStore.getRefreshToken();

      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to refresh the token
        const response = await authService.refresh(refreshToken);
        tokenStore.setAccessToken(response.accessToken);
        tokenStore.setRefreshToken(response.refreshToken);
        setUser(response.user);
      } catch {
        // Refresh failed, clear tokens
        tokenStore.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const response = await authService.login(data);
    tokenStore.setAccessToken(response.accessToken);
    tokenStore.setRefreshToken(response.refreshToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefreshToken();

    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Ignore logout errors
      }
    }

    tokenStore.clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isLoading, login, register, logout }),
    [user, isAuthenticated, isLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
