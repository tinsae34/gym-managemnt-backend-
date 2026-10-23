import axios from 'axios';
import { Member } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
