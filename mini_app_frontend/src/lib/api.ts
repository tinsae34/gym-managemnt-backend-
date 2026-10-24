import axios from 'axios';
import { Member } from '../types';

const getApiBaseUrl = (): string => {
    let url = (import.meta.env.VITE_API_BASE_URL || 'https://gym-managemnt-backend.onrender.com/api').trim();
    url = url.replace(/\/+$/, '');
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    return url;
};

const API_BASE_URL = getApiBaseUrl();

console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.message, error.config?.url);
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        }
        return Promise.reject(error);
    }
);

export const memberApi = {
    // Search member by phone or Telegram ID
    searchMember: async (phoneNumber?: string, telegramId?: string): Promise<Member | null> => {
        try {
            const params = new URLSearchParams();
            if (phoneNumber) params.append('phoneNumber', phoneNumber);
            if (telegramId) params.append('telegramId', telegramId);

            const response = await api.get(`/members/search?${params.toString()}`);
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    // Register new member
    registerMember: async (data: {
        fullName: string;
        phoneNumber: string;
        telegramId?: string;
    }): Promise<Member> => {
        const response = await api.post('/members', data);
        return response.data.data;
    },

    // Get member by ID
    getMember: async (memberId: string): Promise<Member> => {
        const response = await api.get(`/members/${memberId}`);
        return response.data.data;
    },

    // Get all members
    getMembers: async (): Promise<Member[]> => {
        const response = await api.get('/members');
        return response.data.data;
    },
};

export const paymentApi = {
    // Create payment and extend membership
    createPayment: async (data: {
        memberId: string;
        amount: number;
        paymentMethod: 'CASH' | 'DIGITAL';
        transactionRef: string;
    }) => {
        const response = await api.post('/payments', data);
        return response.data.data;
    },
};

export const checkinApi = {
    // Check-in with QR code
    checkIn: async (qrCodeToken: string) => {
        const response = await api.post('/checkin', { qrCodeToken });
        return response.data.data;
    },
};

export default api;
