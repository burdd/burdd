import { createContext, useContext, useMemo, useState} from 'react';

const ApiContext = createContext(undefined);

export const ApiProvider = ({ initialMode = 'mock', children }) => {
  const [mode, setMode] = useState(initialMode);

  const value = useMemo(() => {
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
