import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ApiMode = 'mock' | 'live';

interface ApiContextValue {
  mode: ApiMode;
  baseUrl: string;
  setMode: (mode: ApiMode) => void;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

interface ApiProviderProps {
  initialMode?: ApiMode;
  children: ReactNode;
}

export const ApiProvider = ({ initialMode = 'mock', children }: ApiProviderProps) => {
  const [mode, setMode] = useState<ApiMode>(initialMode);

  const value = useMemo<ApiContextValue>(() => {
    const mockBase = '/mock-api';
    const liveBase = import.meta.env.VITE_API_BASE ?? '/api';

    return {
      mode,
      baseUrl: mode === 'mock' ? mockBase : liveBase,
      setMode,
    };
  }, [mode]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context;
};
