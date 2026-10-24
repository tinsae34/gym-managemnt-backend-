export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

export interface Member {
    id: string;
    fullName: string;
    phoneNumber: string;
    status: 'ACTIVE' | 'EXPIRED' | 'FROZEN';
    startDate: string;
    expiryDate: string;
    qrCodeToken: string;
    telegramId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PlanOption {
    id: string;
    name: string;
    duration: number; // days
    price: number;
    discount?: number;
}

export interface GymDensity {
    currentCapacity: number;
    maxCapacity: number;
    percentage: number;
    status: 'quiet' | 'moderate' | 'busy' | 'crowded';
}
