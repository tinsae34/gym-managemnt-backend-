/**
 * Helper utilities for membership management
 */

/**
 * Calculate days until expiry from a given date
 */
export function daysUntilExpiry(expiryDate: Date): number {
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Check if a membership is expired
 */
export function isMembershipExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
}

/**
 * Get date range for members expiring in N days
 */
export function getExpiryDateRange(days: number): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + (days + 1) * 24 * 60 * 60 * 1000);
    return { start, end };
}

/**
 * Get start and end of current day
 */
export function getTodayRange(): { start: Date; end: Date } {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    return { start, end };
}

/**
 * Format phone number to E.164 format (basic implementation)
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Add country code if not present (assuming Ethiopia +251)
    if (!cleaned.startsWith('251') && cleaned.length === 9) {
        return `+251${cleaned}`;
    }

    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
    // Basic validation for Ethiopian phone numbers
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 15;
}
