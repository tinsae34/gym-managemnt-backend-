import { Request, Response, NextFunction } from 'express';
import { PaymentMethod, MembershipStatus, Prisma } from '@prisma/client';
import prisma from '../config/db';
import { AppError } from '../utils/appError';
import { sendSuccess } from '../utils/response';

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { memberId, amount, paymentMethod, transactionRef } = req.body;

    if (!memberId || typeof memberId !== 'string') {
      throw new AppError('Valid memberId is required.', 400);
    }

    if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new AppError('A valid positive payment amount is required.', 400);
    }

    if (!paymentMethod || !Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)) {
      throw new AppError(
        `Invalid paymentMethod. Allowed values: ${Object.values(PaymentMethod).join(', ')}`,
        400
      );
    }

    const decimalAmount = new Prisma.Decimal(amount);

    // Execute payment and membership extension in an atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current member details
      const member = await tx.member.findUnique({
        where: { id: memberId },
      });

      if (!member) {
        throw new AppError('Member not found.', 404);
      }

      // 2. Calculate new expiry date
      const now = new Date();
      const currentExpiry = new Date(member.expiryDate);
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

      let newExpiryDate: Date;
      // If member is not yet expired, extend from existing expiry date; otherwise extend from now
      if (currentExpiry.getTime() > now.getTime()) {
        newExpiryDate = new Date(currentExpiry.getTime() + THIRTY_DAYS_MS);
      } else {
        newExpiryDate = new Date(now.getTime() + THIRTY_DAYS_MS);
      }

      // 3. Create payment record
      const payment = await tx.payment.create({
        data: {
          memberId: member.id,
          amount: decimalAmount,
          paymentMethod: paymentMethod as PaymentMethod,
          transactionRef: transactionRef ? String(transactionRef).trim() : null,
        },
      });

      // 4. Update member's status to ACTIVE and set updated expiryDate
      const updatedMember = await tx.member.update({
        where: { id: member.id },
        data: {
          expiryDate: newExpiryDate,
          status: MembershipStatus.ACTIVE,
        },
      });

      return {
        payment,
        member: updatedMember,
      };
    });

    sendSuccess(
      res,
      result,
      'Payment processed successfully and membership extended by 30 days.',
      201
    );
  } catch (error) {
    next(error);
  }
};
