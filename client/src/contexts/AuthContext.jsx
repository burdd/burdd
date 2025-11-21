import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout as apiLogout } from '@/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getCurrentUser()
            .then((userData) => {
                if (userData) {
                    setUser({
                        id: userData.id,
                        name: userData.fullName || userData.handle,
                        handle: userData.handle,
                        avatarUrl: userData.avatarUrl,
                        memberships: userData.memberships || [],
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to fetch current user:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!loading && !user && location.pathname !== '/login') {
            navigate('/login', { replace: true });
        }
    }, [loading, user, location.pathname, navigate]);

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = useMemo(() => ({
        user,
        loading,
        logout,
    }), [user, loading]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};
