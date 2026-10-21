/**
 * TypeScript type definitions for SMS service
 */

export interface SMSMessage {
    to: string;
    message: string;
}

export interface SMSBulkResult {
    sent: number;
    failed: number;
}

export interface AfroMessageConfig {
    apiUrl: string;
    apiToken?: string;
    senderId: string;
}

export interface AfroMessageAPIResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}

export enum SMSTemplate {
    THREE_DAY_WARNING = 'three_day_warning',
    SAME_DAY_WARNING = 'same_day_warning',
    EXPIRED_ALERT = 'expired_alert',
    PAYMENT_CONFIRMATION = 'payment_confirmation',
    WELCOME = 'welcome',
}

export interface SMSLog {
    id: string;
    memberId: string;
    phoneNumber: string;
    message: string;
    status: 'sent' | 'failed';
    sentAt: Date;
    error?: string;
}
