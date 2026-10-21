/**
 * Test script for membership cron job functionality
 * 
 * Usage:
 *   ts-node src/test/membership-cron.test.ts
 */

import prisma from '../config/db';
import { smsService } from '../services/sms.service';

async function setupTestData() {
    console.log('🔧 Setting up test data...\n');

    const now = new Date();

    // Clean up existing test members
    await prisma.member.deleteMany({
        where: {
            phoneNumber: {
                startsWith: '+2519999',
            },
        },
    });

    // Create test members for different scenarios
    const testMembers = [
        {
            fullName: 'Test Member - Expiring in 3 Days',
            phoneNumber: '+251999900001',
            status: 'ACTIVE' as const,
            startDate: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000), // 27 days ago
            expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            qrCodeToken: 'TEST3DAYS001',
        },
        {
            fullName: 'Test Member - Expiring Today',
            phoneNumber: '+251999900002',
            status: 'ACTIVE' as const,
            startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            expiryDate: new Date(now.setHours(23, 59, 59, 999)), // Today end of day
            qrCodeToken: 'TESTTODAY002',
        },
        {
            fullName: 'Test Member - Already Expired',
            phoneNumber: '+251999900003',
            status: 'ACTIVE' as const,
            startDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
            expiryDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            qrCodeToken: 'TESTEXPIRED003',
        },
        {
            fullName: 'Test Member - Valid Active',
            phoneNumber: '+251999900004',
            status: 'ACTIVE' as const,
            startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            expiryDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
            qrCodeToken: 'TESTACTIVE004',
        },
    ];

    for (const member of testMembers) {
        await prisma.member.create({ data: member });
        console.log(`✅ Created: ${member.fullName}`);
    }

    console.log('\n✅ Test data setup complete\n');
}

async function testSMSService() {
    console.log('📱 Testing SMS Service...\n');

    const testMessage = {
        to: '+251912345678', // Replace with your test number
        message: 'Test message from Gym Management System - Phase 2 Implementation',
    };

    console.log(`Sending test SMS to ${testMessage.to}...`);
    const result = await smsService.sendSMS(testMessage);

    if (result) {
        console.log('✅ SMS sent successfully\n');
    } else {
        console.log('⚠️  SMS service disabled or failed\n');
    }
}

async function testBulkSMS() {
    console.log('📱 Testing Bulk SMS...\n');

    const messages = [
        {
            to: '+251999900001',
            message: 'Bulk test message 1',
        },
        {
            to: '+251999900002',
            message: 'Bulk test message 2',
        },
        {
            to: '+251999900003',
            message: 'Bulk test message 3',
        },
    ];

    console.log(`Sending ${messages.length} bulk messages...`);
    const result = await smsService.sendBulkSMS(messages);

    console.log(`✅ Sent: ${result.sent}, Failed: ${result.failed}\n`);
}

async function testExpiryQueries() {
    console.log('🔍 Testing Expiry Queries...\n');

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const fourDaysFromNow = new Date(now.getTime() + 96 * 60 * 60 * 1000);

    // Test 3-day expiry query
    const expiring3Days = await prisma.member.findMany({
        where: {
            status: 'ACTIVE',
            expiryDate: {
                gte: threeDaysFromNow,
                lte: fourDaysFromNow,
            },
        },
    });

    console.log(`Members expiring in 3 days: ${expiring3Days.length}`);
    expiring3Days.forEach((m) => console.log(`   - ${m.fullName}`));

    // Test same-day expiry query
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const expiringToday = await prisma.member.findMany({
        where: {
            status: 'ACTIVE',
            expiryDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    console.log(`\nMembers expiring today: ${expiringToday.length}`);
    expiringToday.forEach((m) => console.log(`   - ${m.fullName}`));

    // Test overdue query
    const overdue = await prisma.member.findMany({
        where: {
            status: 'ACTIVE',
            expiryDate: {
                lt: new Date(),
            },
        },
    });

    console.log(`\nOverdue members: ${overdue.length}`);
    overdue.forEach((m) => console.log(`   - ${m.fullName}`));

    console.log('\n✅ Query tests complete\n');
}

async function cleanupTestData() {
    console.log('🧹 Cleaning up test data...\n');

    const result = await prisma.member.deleteMany({
        where: {
            phoneNumber: {
                startsWith: '+2519999',
            },
        },
    });

    console.log(`✅ Deleted ${result.count} test members\n`);
}

async function main() {
    console.log('\n========================================');
    console.log('🧪 Membership Cron Job Test Suite');
    console.log('========================================\n');

    try {
        // Check SMS service status
        console.log(`SMS Service Status: ${smsService.isEnabled() ? '✅ Enabled' : '⚠️  Disabled'}\n`);

        // Run tests
        await setupTestData();
        await testExpiryQueries();
        // await testSMSService(); // Uncomment to test actual SMS
        // await testBulkSMS(); // Uncomment to test bulk SMS

        console.log('========================================');
        console.log('✅ All tests completed successfully');
        console.log('========================================\n');

        // Cleanup
        // await cleanupTestData(); // Uncomment to clean up after testing
    } catch (error) {
        console.error('\n❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
