import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getCurrentUser());
    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return true; // indicate success
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            return true;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    useEffect(() => {
        setUser(authService.getCurrentUser());
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};