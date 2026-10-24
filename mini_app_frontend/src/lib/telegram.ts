import { TelegramUser } from '../types';

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user?: TelegramUser;
                    query_id?: string;
                    auth_date?: number;
                    hash?: string;
                };
                version: string;
                platform: string;
                colorScheme: 'light' | 'dark';
                themeParams: Record<string, string>;
                isExpanded: boolean;
                viewportHeight: number;
                viewportStableHeight: number;
                headerColor: string;
                backgroundColor: string;
                BackButton: {
                    isVisible: boolean;
                    show: () => void;
                    hide: () => void;
                    onClick: (callback: () => void) => void;
                    offClick: (callback: () => void) => void;
                };
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    isProgressVisible: boolean;
                    setText: (text: string) => void;
                    onClick: (callback: () => void) => void;
                    offClick: (callback: () => void) => void;
                    show: () => void;
                    hide: () => void;
                    enable: () => void;
                    disable: () => void;
                    showProgress: (leaveActive: boolean) => void;
                    hideProgress: () => void;
                    setParams: (params: {
                        text?: string;
                        color?: string;
                        text_color?: string;
                        is_active?: boolean;
                        is_visible?: boolean;
                    }) => void;
                };
                HapticFeedback: {
                    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
                    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
                    selectionChanged: () => void;
                };
                expand: () => void;
                close: () => void;
                ready: () => void;
                openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
                openTelegramLink: (url: string) => void;
                showPopup: (params: {
                    title?: string;
                    message: string;
                    buttons?: Array<{ id?: string; type?: string; text: string }>;
                }, callback?: (buttonId: string) => void) => void;
                showAlert: (message: string, callback?: () => void) => void;
                showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
            };
        };
    }
}

export const tg = window.Telegram?.WebApp;

export const getTelegramUser = (): TelegramUser | null => {
    const user = tg?.initDataUnsafe?.user;

    // Development fallback when testing outside Telegram
    if (!user && import.meta.env.DEV) {
        console.warn('Running in development mode without Telegram. Using mock user.');
        return {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
        };
    }

    return user || null;
};

export const showAlert = (message: string, callback?: () => void) => {
    if (tg?.showAlert) {
        try {
            tg.showAlert(message, callback);
        } catch (error) {
            // Fallback for older Telegram versions
            alert(message);
            if (callback) callback();
        }
    } else {
        alert(message);
        if (callback) callback();
    }
};

export const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    if (tg?.showConfirm) {
        try {
            tg.showConfirm(message, callback);
        } catch (error) {
            // Fallback for older Telegram versions
            const result = confirm(message);
            if (callback) callback(result);
        }
    } else {
        const result = confirm(message);
        if (callback) callback(result);
    }
};

export const hapticFeedback = {
    light: () => tg?.HapticFeedback?.impactOccurred('light'),
    medium: () => tg?.HapticFeedback?.impactOccurred('medium'),
    heavy: () => tg?.HapticFeedback?.impactOccurred('heavy'),
    success: () => tg?.HapticFeedback?.notificationOccurred('success'),
    error: () => tg?.HapticFeedback?.notificationOccurred('error'),
    warning: () => tg?.HapticFeedback?.notificationOccurred('warning'),
    selection: () => tg?.HapticFeedback?.selectionChanged(),
};

export const initTelegram = () => {
    if (tg) {
        tg.ready();
        tg.expand();
    }
};
