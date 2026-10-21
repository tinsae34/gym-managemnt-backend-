import cron from 'node-cron';
import prisma from '../config/db';
import { smsService } from '../services/sms.service';

/**
 * Format date to readable string (e.g., "Jan 15, 2024")
 */
const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

/**
 * Task 1: Send 3-day expiry warning to active members
 * Notifies members whose membership expires in 72-96 hours
 */
async function send3DayExpiryWarnings(): Promise<void> {
    console.log('📅 Running 3-day expiry warning task...');

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const fourDaysFromNow = new Date(now.getTime() + 96 * 60 * 60 * 1000);

    try {
        const members = await prisma.member.findMany({
            where: {
                status: 'ACTIVE',
                expiryDate: {
                    gte: threeDaysFromNow,
                    lte: fourDaysFromNow,
                },
            },
        });

        console.log(`   Found ${members.length} members expiring in 3 days`);

        const messages = members.map((member) => ({
            to: member.phoneNumber,
            message: `Hi ${member.fullName}, your gym membership expires in 3 days on ${formatDate(
                member.expiryDate
            )}. Please renew at reception or online to avoid interruption.`,
        }));

        const results = await smsService.sendBulkSMS(messages);
        console.log(
            `   ✅ Sent ${results.sent} warnings, ${results.failed} failed`
        );
    } catch (error) {
        console.error('   ❌ Error in 3-day expiry warning task:', error);
    }
}

/**
 * Task 2: Send same-day expiry warning to active members
 * Notifies members whose membership expires today
 */
async function sendSameDayExpiryWarnings(): Promise<void> {
    console.log('📅 Running same-day expiry warning task...');

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    try {
        const members = await prisma.member.findMany({
            where: {
                status: 'ACTIVE',
                expiryDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        console.log(`   Found ${members.length} members expiring today`);

        const messages = members.map((member) => ({
            to: member.phoneNumber,
            message: `Hi ${member.fullName}, your gym membership expires TODAY! Visit the front desk or renew online to keep your active pass.`,
        }));

        const results = await smsService.sendBulkSMS(messages);
        console.log(
            `   ✅ Sent ${results.sent} warnings, ${results.failed} failed`
        );
    } catch (error) {
        console.error('   ❌ Error in same-day expiry warning task:', error);
    }
}

/**
 * Task 3: Mark overdue memberships as expired and notify
 * Updates status from ACTIVE to EXPIRED for overdue members
 */
async function markOverdueAsExpired(): Promise<void> {
    console.log('📅 Running overdue membership expiration task...');

    const now = new Date();

    try {
        // Find all active members whose expiry date has passed
        const overdueMembers = await prisma.member.findMany({
            where: {
                status: 'ACTIVE',
                expiryDate: {
                    lt: now,
                },
            },
        });

        console.log(`   Found ${overdueMembers.length} overdue members`);

        if (overdueMembers.length === 0) {
            return;
        }

        // Update all overdue members to EXPIRED status
        const updateResult = await prisma.member.updateMany({
            where: {
                status: 'ACTIVE',
                expiryDate: {
                    lt: now,
                },
            },
            data: {
                status: 'EXPIRED',
            },
        });

        console.log(`   ✅ Updated ${updateResult.count} members to EXPIRED status`);

        // Send SMS notifications
        const messages = overdueMembers.map((member) => ({
            to: member.phoneNumber,
            message: `Hi ${member.fullName}, your gym membership has expired. Renew today to regain workout access!`,
        }));

        const results = await smsService.sendBulkSMS(messages);
        console.log(
            `   ✅ Sent ${results.sent} expiry alerts, ${results.failed} failed`
        );
    } catch (error) {
        console.error('   ❌ Error in overdue expiration task:', error);
    }
}

/**
 * Main cron job handler
 * Executes all membership management tasks
 */
async function runMembershipTasks(): Promise<void> {
    console.log('\n🔄 ========================================');
    console.log('🔄 Starting daily membership check tasks');
    console.log(`🔄 Timestamp: ${new Date().toISOString()}`);
    console.log('🔄 ========================================\n');

    try {
        // Run all tasks sequentially
        await send3DayExpiryWarnings();
        await sendSameDayExpiryWarnings();
        await markOverdueAsExpired();

        console.log('\n✅ ========================================');
        console.log('✅ Daily membership tasks completed');
        console.log('✅ ========================================\n');
    } catch (error) {
        console.error('\n❌ ========================================');
        console.error('❌ Error during membership tasks:', error);
        console.error('❌ ========================================\n');
    }
}

/**
 * Initialize and start the membership cron job
 */
export function initMembershipCron(): void {
    const cronSchedule = process.env.CRON_SCHEDULE || '0 9 * * *';
    const isEnabled = process.env.ENABLE_CRON_JOBS !== 'false';

    if (!isEnabled) {
        console.log('⏸️  Membership cron jobs are disabled (ENABLE_CRON_JOBS=false)');
        return;
    }

    // Validate cron schedule
    if (!cron.validate(cronSchedule)) {
        console.error(`❌ Invalid cron schedule: ${cronSchedule}`);
        console.error('   Using default schedule: 0 9 * * * (daily at 9:00 AM)');
        return;
    }

    console.log('⏰ Initializing membership cron job...');
    console.log(`   Schedule: ${cronSchedule} (${describeCronSchedule(cronSchedule)})`);
    console.log(`   SMS Service: ${smsService.isEnabled() ? 'Enabled ✅' : 'Disabled ⚠️'}`);

    // Schedule the cron job
    cron.schedule(cronSchedule, runMembershipTasks, {
        timezone: 'Africa/Addis_Ababa', // Adjust to your timezone
        scheduled: true,
    });

    console.log('✅ Membership cron job initialized successfully\n');

    // Optional: Run immediately on startup in development
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Running membership tasks immediately...\n');
        runMembershipTasks();
    }
}

/**
 * Helper function to describe cron schedule in human-readable format
 */
function describeCronSchedule(schedule: string): string {
    const parts = schedule.split(' ');
    if (schedule === '0 9 * * *') return 'Daily at 9:00 AM';
    if (schedule === '0 0 * * *') return 'Daily at midnight';
    if (schedule === '*/5 * * * *') return 'Every 5 minutes';
    if (schedule === '0 */6 * * *') return 'Every 6 hours';
    return schedule;
}
