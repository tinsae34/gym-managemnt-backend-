/**
 * Manual Cron Job Execution Script
 * 
 * Runs the membership cron tasks manually without waiting for schedule
 * Useful for testing and debugging
 * 
 * Usage: npx ts-node scripts/manual-cron-run.ts
 */

import prisma from '../src/config/db';
import { smsService } from '../src/services/sms.service';

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

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

        if (members.length > 0) {
            console.log('\n   Members:');
            members.forEach((m) => {
                console.log(`   - ${m.fullName} (${m.phoneNumber}) - Expires: ${formatDate(m.expiryDate)}`);
            });
        }

        const messages = members.map((member) => ({
            to: member.phoneNumber,
            message: `Hi ${member.fullName}, your gym membership expires in 3 days on ${formatDate(
                member.expiryDate
            )}. Please renew at reception or online to avoid interruption.`,
        }));

        const results = await smsService.sendBulkSMS(messages);
        console.log(`\n   ✅ Sent ${results.sent} warnings, ${results.failed} failed\n`);
    } catch (error) {
        console.error('   ❌ Error:', error);
    }
}

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

        if (members.length > 0) {
            console.log('\n   Members:');
            members.forEach((m) => {
                console.log(`   - ${m.fullName} (${m.phoneNumber}) - Expires: ${formatDate(m.expiryDate)}`);
            });
        }

        const messages = members.map((member) => ({
            to: member.phoneNumber,
            message: `Hi ${member.fullName}, your gym membership expires TODAY! Visit the front desk or renew online to keep your active pass.`,
        }));

        const results = await smsService.sendBulkSMS(messages);
        console.log(`\n   ✅ Sent ${results.sent} warnings, ${results.failed} failed\n`);
    } catch (error) {
        console.error('   ❌ Error:', error);
    }
}

async function markOverdueAsExpired(): Promise<void> {
    console.log('📅 Running overdue membership expiration task...');

    const now = new Date();

    try {
        const overdueMembers = await prisma.member.findMany({
            where: {
                status: 'ACTIVE',
                expiryDate: {
                    lt: now,
                },
            },
        });

        console.log(`   Found ${overdueMembers.length} overdue members`);

        if (overdueMembers.length > 0) {
            console.log('\n   Overdue Members:');
            overdueMembers.forEach((m) => {
                console.log(`   - ${m.fullName} (${m.phoneNumber}) - Expired: ${formatDate(m.expiryDate)}`);
            });

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

            console.log(`\n   ✅ Updated ${updateResult.count} members to EXPIRED status`);

            const messages = overdueMembers.map((member) => ({
                to: member.phoneNumber,
                message: `Hi ${member.fullName}, your gym membership has expired. Renew today to regain workout access!`,
            }));

            const results = await smsService.sendBulkSMS(messages);
            console.log(`   ✅ Sent ${results.sent} expiry alerts, ${results.failed} failed\n`);
        }
    } catch (error) {
        console.error('   ❌ Error:', error);
    }
}

async function main() {
    console.log('\n🔄 ========================================');
    console.log('🔄 Manual Cron Job Execution');
    console.log(`🔄 Timestamp: ${new Date().toISOString()}`);
    console.log('🔄 ========================================\n');

    console.log(`SMS Service: ${smsService.isEnabled() ? '✅ Enabled' : '⚠️  Disabled'}\n`);

    try {
        await send3DayExpiryWarnings();
        await sendSameDayExpiryWarnings();
        await markOverdueAsExpired();

        console.log('✅ ========================================');
        console.log('✅ All tasks completed successfully');
        console.log('✅ ========================================\n');
    } catch (error) {
        console.error('\n❌ ========================================');
        console.error('❌ Error during execution:', error);
        console.error('❌ ========================================\n');
    } finally {
        await prisma.$disconnect();
    }
}

main();
