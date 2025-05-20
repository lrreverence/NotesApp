import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const createAccount = async (userData) => {
    try {
        const response = await api.post('/create-account', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUser = async () => {
    try {
        const response = await api.get('/get-user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Notes APIs
export const addNote = async (noteData) => {
    try {
        const response = await api.post('/add-note', noteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const editNote = async (noteId, noteData) => {
    try {
        const response = await api.put(`/edit-note/${noteId}`, noteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllNotes = async () => {
    try {
        const response = await api.get('/get-all-notes');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteNote = async (noteId) => {
    try {
        const response = await api.delete(`/delete-note/${noteId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateNotePinned = async (noteId, isPinned) => {
    try {
        const response = await api.put(`/update-note-pinned/${noteId}`, { isPinned });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const searchNotes = async (query) => {
    try {
        const response = await api.get(`/search-notes?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 