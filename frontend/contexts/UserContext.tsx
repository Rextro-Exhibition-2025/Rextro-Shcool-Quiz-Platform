'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

interface User {
    memberName: string;
    schoolName: string;
    teamName: string;
    authToken: string;  // Add this field
    marks?: number;     // Make this optional since it's not in login response
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    error: string | null;
    logout: () => void;
}

interface ApiResponse {
    success: boolean;
    data: User;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => null,
    loading: false,
    error: null,
    logout: () => null
});

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('userData');
            return cached ? JSON.parse(cached) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('memberName');
        localStorage.removeItem('schoolName');
        localStorage.removeItem('teamName');
        localStorage.removeItem('marks');
        setUser(null);
        window.location.href = '/login'; // Redirect to login page
    };

    useEffect(() => {
        let mounted = true;

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    if (mounted) {
                        setLoading(false);
                    }
                    return;
                }

                const response = await axios.get<ApiResponse>('http://localhost:3000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success && mounted) {
                    const userData = response.data.data;
                    setUser(userData);
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            } catch (err) {
                if (mounted) {
                    console.error('Error fetching user:', err);
                    setError(err instanceof Error ? err.message : 'An error occurred');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('memberName');
                    localStorage.removeItem('schoolName');
                    localStorage.removeItem('teamName');
                    localStorage.removeItem('marks');
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            mounted = false;
        };
    }, []);

    const value = {
        user,
        setUser,
        loading,
        error,
        logout
    };

    return (
        <UserContext.Provider value={value} >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;