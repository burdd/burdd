import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AuthContext = createContext(undefined);
const storageKey = 'burdd:user';
const mockUser = {
    id: 'user-abdul',
    name: 'Abdul-Rashid Zakaria',
    avatarUrl: 'https://avatars.githubusercontent.com/u/000000?v=4',
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            }
            catch {
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
    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
    }), [user, loading]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};
