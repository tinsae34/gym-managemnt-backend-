import { Request, Response, NextFunction } from 'express';
import { MembershipStatus } from '@prisma/client';
import prisma from '../config/db';
import { AppError } from '../utils/appError';
import { sendSuccess } from '../utils/response';

export const recordCheckIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { qrCodeToken } = req.body;

    if (!qrCodeToken || typeof qrCodeToken !== 'string' || !qrCodeToken.trim()) {
      throw new AppError('Valid qrCodeToken is required in request body.', 400);
    }

    const token = qrCodeToken.trim();

    // 1. Check if member exists
    const member = await prisma.member.findUnique({
      where: { qrCodeToken: token },
    });

    if (!member) {
      throw new AppError('Member not found with the provided QR code token.', 404);
    }

    const now = new Date();
    const expiryDate = new Date(member.expiryDate);

    // 2. Validate membership status and expiry
    if (member.status === MembershipStatus.FROZEN) {
      throw new AppError('Membership is currently frozen. Please unfreeze at reception.', 400);
    }

    if (expiryDate.getTime() <= now.getTime() || member.status === MembershipStatus.EXPIRED) {
      // Sync status to EXPIRED if not already set
      if (member.status !== MembershipStatus.EXPIRED) {
        await prisma.member.update({
          where: { id: member.id },
          data: { status: MembershipStatus.EXPIRED },
        });
      }

      throw new AppError('Membership expired', 400);
    }

    // 3. Member is ACTIVE & valid - record check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        memberId: member.id,
        createdAt: now,
      },
    });

    sendSuccess(
      res,
      {
        checkIn,
        member: {
          id: member.id,
          fullName: member.fullName,
          status: member.status,
          expiryDate: member.expiryDate,
        },
      },
      'Check-in successful. Welcome to the gym!'
    );
  } catch (error) {
    next(error);
  }
};
