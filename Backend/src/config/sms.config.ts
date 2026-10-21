/**
 * SMS service configuration
 */

export const smsConfig = {
    // AfroMessage API endpoint
    apiUrl: 'https://api.afromessage.com/api/send-sms',

    // API token from environment
    apiToken: process.env.AFROMESSAGE_API_TOKEN,

    // Sender ID (name shown on SMS)
    senderId: process.env.AFROMESSAGE_SENDER_ID || 'GYM_MGMT',

    // Request timeout (milliseconds)
    timeout: 10000,

    // Retry configuration
    retry: {
        maxAttempts: 3,
        delayMs: 1000,
    },

    // Rate limiting
    rateLimit: {
        maxPerMinute: 60,
        maxPerHour: 500,
    },
};

/**
 * SMS message templates
 */
export const smsTemplates = {
    threeDayWarning: (name: string, expiryDate: string) =>
        `Hi ${name}, your gym membership expires in 3 days on ${expiryDate}. Please renew at reception or online to avoid interruption.`,

    sameDayWarning: (name: string) =>
        `Hi ${name}, your gym membership expires TODAY! Visit the front desk or renew online to keep your active pass.`,

    expiredAlert: (name: string) =>
        `Hi ${name}, your gym membership has expired. Renew today to regain workout access!`,

    paymentConfirmation: (name: string, amount: string, newExpiryDate: string) =>
        `Hi ${name}, payment of ${amount} received. Your membership is now active until ${newExpiryDate}. Thank you!`,

    welcome: (name: string, expiryDate: string) =>
        `Welcome to our gym, ${name}! Your membership is active until ${expiryDate}. Show your QR code at reception to check in.`,

    renewalReminder: (name: string, daysLeft: number) =>
        `Hi ${name}, your gym membership expires in ${daysLeft} days. Renew now to avoid interruption!`,

    frozenNotification: (name: string) =>
        `Hi ${name}, your gym membership has been frozen. Contact reception to reactivate.`,
};

/**
 * Phone number validation patterns
 */
export const phonePatterns = {
    ethiopia: /^(\+251|251|0)?[97]\d{8}$/,
    international: /^\+?[1-9]\d{1,14}$/,
};

/**
 * Validate phone number format
 */
export function validatePhone(phone: string, pattern: 'ethiopia' | 'international' = 'ethiopia'): boolean {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return phonePatterns[pattern].test(cleaned);
}

/**
 * Format phone number to E.164 standard
 */
export function formatPhoneE164(phone: string, countryCode: string = '251'): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Remove leading zeros
    cleaned = cleaned.replace(/^0+/, '');

    // Remove country code if present
    if (cleaned.startsWith(countryCode)) {
        cleaned = cleaned.substring(countryCode.length);
    }
    if (cleaned.startsWith(`+${countryCode}`)) {
        cleaned = cleaned.substring(countryCode.length + 1);
    }

    // Add country code
    return `+${countryCode}${cleaned}`;
}
