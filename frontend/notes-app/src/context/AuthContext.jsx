import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, createAccount as apiCreateAccount, getUser } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await getUser();
            setUser(response.user);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('accessToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await apiLogin(credentials);
        localStorage.setItem('accessToken', response.accessToken);
        setUser(response.user);
        return response;
    };

    const signup = async (userData) => {
        const response = await apiCreateAccount(userData);
        localStorage.setItem('accessToken', response.accessToken);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 