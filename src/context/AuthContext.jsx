import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { api, setAuthToken, clearAuthToken, getAuthToken } from "../api/client";
import { setCurrentUserId, clearUserData, initializeUserStorage } from "../utils/storage";

// Use backend API exclusively

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

/**
 * Clear all user session data (called on logout)
 */
const clearSessionData = () => {
    // Clear auth token
    clearAuthToken();
    
    // Clear current user ID marker (but keep user-specific data intact for if they log back in)
    setCurrentUserId(null);
    
    // Dispatch event to notify components
    window.dispatchEvent(new Event("userLoggedOut"));
};

/**
 * Initialize session for new user (called on login/register)
 */
const initializeUserSession = (userId) => {
    // Set up user-isolated storage
    initializeUserStorage(userId);
    
    // Dispatch event to notify components
    window.dispatchEvent(new Event("userLoggedIn"));
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBackendAvailable, setIsBackendAvailable] = useState(null);
    const backendCheckedRef = useRef(false);

    // Check backend health on mount
    useEffect(() => {
        const checkBackend = async () => {
            if (backendCheckedRef.current) return;
            backendCheckedRef.current = true;
            
            try {
                const response = await api.health();
                setIsBackendAvailable(response.success === true);
                console.log('Backend available:', response.success === true);
            } catch (error) {
                console.warn('Backend not available:', error.message);
                setIsBackendAvailable(false);
            }
        };
        checkBackend();
    }, []);

    // Verify existing token
    useEffect(() => {
        // Wait until backend availability is determined
        if (isBackendAvailable === null) return;
        
        const verifyAuth = async () => {
            const token = getAuthToken();

            if (isBackendAvailable && token) {
                try {
                    const response = await api.auth.verify();
                    if (response.success) {
                        const user = response.data.user;
                        // Initialize user session with their ID
                        initializeUserSession(user._id || user.id);
                        setCurrentUser(user);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    clearSessionData();
                }
            }

            // Backend is not available or no token
            setLoading(false);
        };

        verifyAuth();
    }, [isBackendAvailable]);

    // Register new user
    const signup = useCallback(async (email, password, name = '') => {
        // Clear any previous user data first
        clearSessionData();
        
        try {
            const response = await api.auth.register(email, password, name);
            if (response.success) {
                const user = response.data;
                setAuthToken(response.token);
                // Initialize fresh session for new user
                initializeUserSession(user._id || user.id);
                setCurrentUser(user);
                setIsBackendAvailable(true);
                // Don't sync old data - this is a new user!
                return user;
            }
            throw new Error(response.error || 'Registration failed');
        } catch (error) {
            console.error('Backend registration failed:', error);
            throw error;
        }
    }, []);

    // Login user
    const login = useCallback(async (email, password) => {
        // Clear any previous user session first
        clearSessionData();
        
        try {
            const response = await api.auth.login(email, password);
            if (response.success) {
                const user = response.data;
                setAuthToken(response.token);
                // Initialize session for this user
                initializeUserSession(user._id || user.id);
                setCurrentUser(user);
                setIsBackendAvailable(true);
                return user;
            }
            throw new Error(response.error || 'Login failed');
        } catch (error) {
            console.error('Backend login failed:', error);
            throw error;
        }
    }, []);

    // Logout user
    const logout = useCallback(async () => {
        // Clear all session data
        clearSessionData();
        
        if (isBackendAvailable) {
            try {
                await api.auth.logout();
            } catch (error) {
                console.error('Logout API error:', error);
            }
        }
        
        setCurrentUser(null);
        
        // Dispatch event to force UI refresh
        window.dispatchEvent(new Event("progressUpdated"));
        window.dispatchEvent(new Event("gamificationUpdated"));
    }, [isBackendAvailable]);

    // Update user profile
    const updateProfile = useCallback(async (data) => {
        if (isBackendAvailable) {
            try {
                const response = await api.users.updateProfile(data);
                if (response.success) {
                    setCurrentUser(prev => ({ ...prev, ...response.data }));
                    return response.data;
                }
                throw new Error(response.error || 'Update failed');
            } catch (error) {
                throw error;
            }
        }
        return null;
    }, [isBackendAvailable]);

    // Get user stats
    const getUserStats = useCallback(async () => {
        if (isBackendAvailable && currentUser) {
            try {
                const response = await api.users.getStats();
                if (response.success) {
                    return response.data;
                }
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        }
        return null;
    }, [isBackendAvailable, currentUser]);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        if (isBackendAvailable && getAuthToken()) {
            try {
                const response = await api.auth.getMe();
                if (response.success) {
                    setCurrentUser(response.data);
                }
            } catch (error) {
                console.error('Failed to refresh user:', error);
            }
        }
    }, [isBackendAvailable]);

    const value = {
        currentUser,
        isBackendAvailable,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        getUserStats,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
