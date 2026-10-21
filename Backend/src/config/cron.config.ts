/**
 * Cron job configuration settings
 */

export const cronConfig = {
    // Default schedule: Daily at 9:00 AM
    defaultSchedule: '0 9 * * *',

    // Timezone for cron execution
    timezone: 'Africa/Addis_Ababa',

    // Enable/disable cron jobs
    enabled: process.env.ENABLE_CRON_JOBS !== 'false',

    // Custom schedule from environment
    schedule: process.env.CRON_SCHEDULE || '0 9 * * *',

    // Expiry warning thresholds (in hours)
    warnings: {
        threeDayWarning: {
            minHours: 72,  // 3 days
            maxHours: 96,  // 4 days
        },
        sameDayWarning: {
            startHour: 0,
            endHour: 23,
        },
    },

    // Run on startup in development mode
    runOnStartup: process.env.NODE_ENV === 'development',
};

/**
 * Predefined cron schedules for common use cases
 */
export const cronSchedules = {
    // Daily schedules
    dailyAt9AM: '0 9 * * *',
    dailyAtMidnight: '0 0 * * *',
    dailyAt6PM: '0 18 * * *',

    // Hourly schedules
    everyHour: '0 * * * *',
    every6Hours: '0 */6 * * *',
    every12Hours: '0 */12 * * *',

    // Weekly schedules
    mondayAt9AM: '0 9 * * 1',
    weekdaysAt9AM: '0 9 * * 1-5',
    weekendAt10AM: '0 10 * * 0,6',

    // Testing schedules
    everyMinute: '* * * * *',
    every5Minutes: '*/5 * * * *',
    every15Minutes: '*/15 * * * *',
};

/**
 * Validate a cron schedule string
 */
export function validateCronSchedule(schedule: string): boolean {
    const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    return cronRegex.test(schedule);
}

/**
 * Get human-readable description of cron schedule
 */
export function describeCronSchedule(schedule: string): string {
    const descriptions: Record<string, string> = {
        '0 9 * * *': 'Daily at 9:00 AM',
        '0 0 * * *': 'Daily at midnight',
        '0 18 * * *': 'Daily at 6:00 PM',
        '0 * * * *': 'Every hour',
        '0 */6 * * *': 'Every 6 hours',
        '0 */12 * * *': 'Every 12 hours',
        '0 9 * * 1': 'Every Monday at 9:00 AM',
        '0 9 * * 1-5': 'Weekdays at 9:00 AM',
        '* * * * *': 'Every minute',
        '*/5 * * * *': 'Every 5 minutes',
        '*/15 * * * *': 'Every 15 minutes',
    };

    return descriptions[schedule] || schedule;
}
