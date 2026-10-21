import axios, { AxiosError } from 'axios';

interface SendSMSParams {
    to: string;
    message: string;
}

interface AfroMessageResponse {
    success: boolean;
    message?: string;
    data?: any;
}

/**
 * SMS Service using AfroMessage API
 * Sends transactional SMS messages to gym members
 */
class SMSService {
    private apiUrl = 'https://api.afromessage.com/api/send-sms';
    private apiToken: string | undefined;
    private senderId: string;
    private isConfigured: boolean;

    constructor() {
        this.apiToken = process.env.AFROMESSAGE_API_TOKEN;
        this.senderId = process.env.AFROMESSAGE_SENDER_ID || 'GYM_MGMT';
        this.isConfigured = !!this.apiToken;

        if (!this.isConfigured) {
            console.warn(
                '⚠️  AfroMessage API token not configured. SMS notifications will be disabled.'
            );
            console.warn('   Set AFROMESSAGE_API_TOKEN in your .env file to enable SMS.');
        }
    }

    /**
     * Send SMS to a single recipient
     * @param params - SMS parameters (to, message)
     * @returns Promise with success status
     */
    async sendSMS({ to, message }: SendSMSParams): Promise<boolean> {
        // Graceful fallback if API token is missing
        if (!this.isConfigured) {
            console.log(`📱 [SMS DISABLED] Would send to ${to}: ${message}`);
            return false;
        }

        try {
            // Clean phone number (remove spaces, dashes, etc.)
            const cleanPhone = to.replace(/[\s\-\(\)]/g, '');

            // Make API request
            const response = await axios.get<AfroMessageResponse>(this.apiUrl, {
                params: {
                    to: cleanPhone,
                    message,
                    from: this.senderId,
                },
                headers: {
                    Authorization: `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 second timeout
            });

            if (response.data.success) {
                console.log(`✅ SMS sent successfully to ${to}`);
                return true;
            } else {
                console.error(`❌ SMS failed to ${to}: ${response.data.message}`);
                return false;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error(
                    `❌ SMS API error for ${to}:`,
                    axiosError.response?.data || axiosError.message
                );
            } else {
                console.error(`❌ Unexpected error sending SMS to ${to}:`, error);
            }
            return false;
        }
    }

    /**
     * Send bulk SMS messages
     * @param messages - Array of SMS messages to send
     * @returns Promise with count of successful sends
     */
    async sendBulkSMS(
        messages: SendSMSParams[]
    ): Promise<{ sent: number; failed: number }> {
        const results = await Promise.allSettled(
            messages.map((msg) => this.sendSMS(msg))
        );

        const sent = results.filter(
            (r) => r.status === 'fulfilled' && r.value === true
        ).length;
        const failed = results.length - sent;

        return { sent, failed };
    }

    /**
     * Check if SMS service is properly configured
     */
    isEnabled(): boolean {
        return this.isConfigured;
    }
}

// Export singleton instance
export const smsService = new SMSService();

// Export for direct usage
export const sendSMS = (params: SendSMSParams) => smsService.sendSMS(params);
