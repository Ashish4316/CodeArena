/**
 * API Configuration and Base Client
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace('/api', ''); // For non-API endpoints like health

// Token management
let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
    authToken = null;
    localStorage.removeItem('authToken');
};

/**
 * Base fetch wrapper with authentication and error handling
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
    };

    const config = {
        ...options,
        credentials: 'include', // Ensure cookies are sent with requests
        headers,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

/**
 * API Methods
 */
export const api = {
    // Health check (at server root, not under /api)
    health: async () => {
        try {
            const response = await fetch(`${SERVER_BASE_URL}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Health check failed:', error);
            return { success: false };
        }
    },

    // ============ AUTH ============
    auth: {
        register: (email, password, name) =>
            apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name }),
            }),

        login: (email, password) =>
            apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),

        logout: () =>
            apiRequest('/auth/logout', { method: 'POST' }),

        getMe: () =>
            apiRequest('/auth/me', { method: 'GET' }),

        verify: () =>
            apiRequest('/auth/verify', { method: 'GET' }),

        updateDetails: (data) =>
            apiRequest('/auth/updatedetails', {
                method: 'PUT',
                body: JSON.stringify(data),
            }),

        updatePassword: (currentPassword, newPassword) =>
            apiRequest('/auth/updatepassword', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
            }),
    },

    // ============ USERS ============
    users: {
        getProfile: () =>
            apiRequest('/users/profile', { method: 'GET' }),

        updateProfile: (data) =>
            apiRequest('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            }),

        getStats: () =>
            apiRequest('/users/stats', { method: 'GET' }),

        getCalendar: (year) =>
            apiRequest(`/users/calendar${year ? `?year=${year}` : ''}`, { method: 'GET' }),

        getAchievements: () =>
            apiRequest('/users/achievements', { method: 'GET' }),

        getSubmissions: (page = 1, limit = 20, sheetSlug, status) => {
            const params = new URLSearchParams({ page, limit });
            if (sheetSlug) params.append('sheetSlug', sheetSlug);
            if (status) params.append('status', status);
            return apiRequest(`/users/submissions?${params}`, { method: 'GET' });
        },

        getLeaderboard: (limit = 50) =>
            apiRequest(`/users/leaderboard?limit=${limit}`, { method: 'GET' }),
    },

    // ============ SHEETS ============
    sheets: {
        getAll: (type, page = 1, limit = 20) => {
            const params = new URLSearchParams({ page, limit });
            if (type) params.append('type', type);
            return apiRequest(`/sheets?${params}`, { method: 'GET' });
        },

        getBySlug: (slug) =>
            apiRequest(`/sheets/${slug}`, { method: 'GET' }),

        create: (data) =>
            apiRequest('/sheets', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        update: (slug, data) =>
            apiRequest(`/sheets/${slug}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),

        delete: (slug) =>
            apiRequest(`/sheets/${slug}`, { method: 'DELETE' }),

        getStats: (slug) =>
            apiRequest(`/sheets/${slug}/stats`, { method: 'GET' }),

        search: (query, limit = 10) =>
            apiRequest(`/sheets/search?q=${encodeURIComponent(query)}&limit=${limit}`, { method: 'GET' }),
    },

    // ============ PROGRESS ============
    progress: {
        getAll: () =>
            apiRequest('/progress', { method: 'GET' }),

        getBySheet: (sheetSlug) =>
            apiRequest(`/progress/${sheetSlug}`, { method: 'GET' }),

        update: (sheetSlug, questionId, solved, difficulty, questionTitle) =>
            apiRequest(`/progress/${sheetSlug}`, {
                method: 'POST',
                body: JSON.stringify({ questionId, solved, difficulty, questionTitle }),
            }),

        sync: (progress, dailyProgress) =>
            apiRequest('/progress/sync', {
                method: 'POST',
                body: JSON.stringify({ progress, dailyProgress }),
            }),

        getDaily: (startDate, endDate) => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            return apiRequest(`/progress/daily?${params}`, { method: 'GET' });
        },

        export: () =>
            apiRequest('/progress/export', { method: 'GET' }),
    },

    // ============ NOTES ============
    notes: {
        getAll: (sheetSlug, page = 1, limit = 50) => {
            const params = new URLSearchParams({ page, limit });
            if (sheetSlug) params.append('sheetSlug', sheetSlug);
            return apiRequest(`/notes?${params}`, { method: 'GET' });
        },

        get: (questionId, sheetSlug) => {
            const params = sheetSlug ? `?sheetSlug=${sheetSlug}` : '';
            return apiRequest(`/notes/${questionId}${params}`, { method: 'GET' });
        },

        save: (questionId, sheetSlug, content, code, language, tags) =>
            apiRequest('/notes', {
                method: 'POST',
                body: JSON.stringify({ questionId, sheetSlug, content, code, language, tags }),
            }),

        delete: (questionId, sheetSlug) => {
            const params = sheetSlug ? `?sheetSlug=${sheetSlug}` : '';
            return apiRequest(`/notes/${questionId}${params}`, { method: 'DELETE' });
        },

        sync: (notes) =>
            apiRequest('/notes/sync', {
                method: 'POST',
                body: JSON.stringify({ notes }),
            }),
    },
};

export default api;
