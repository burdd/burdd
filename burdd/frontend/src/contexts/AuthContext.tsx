import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { UserLookup } from '@/types/api';

interface AuthContextValue {
  user: UserLookup | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const storageKey = 'burdd:user';
const mockUser: UserLookup = {
  id: 'user-abdul',
  name: 'Abdul-Rashid Zakaria',
  avatarUrl: 'https://avatars.githubusercontent.com/u/000000?v=4',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserLookup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
    setLoading(false);
  }, []);

  const login = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    localStorage.setItem(storageKey, JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
