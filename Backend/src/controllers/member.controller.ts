import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MembershipStatus } from '@prisma/client';
import prisma from '../config/db';
import { AppError } from '../utils/appError';
import { sendSuccess } from '../utils/response';

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, phoneNumber, telegramId } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      throw new AppError('Full name is required.', 400);
    }

    if (!phoneNumber || typeof phoneNumber !== 'string' || !phoneNumber.trim()) {
      throw new AppError('Phone number is required.', 400);
    }

    const trimmedPhone = phoneNumber.trim();
    const trimmedName = fullName.trim();

    // Check if phone number is already registered
    const existingMember = await prisma.member.findUnique({
      where: { phoneNumber: trimmedPhone },
    });

    if (existingMember) {
      throw new AppError('A member with this phone number already exists.', 409);
    }

    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
    const qrCodeToken = uuidv4();

    const newMember = await prisma.member.create({
      data: {
        fullName: trimmedName,
        phoneNumber: trimmedPhone,
        telegramId: telegramId?.trim() || undefined,
        status: MembershipStatus.ACTIVE,
        startDate: now,
        expiryDate: expiryDate,
        qrCodeToken: qrCodeToken,
      },
    });

    sendSuccess(res, newMember, 'Member registered successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        checkIns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!member) {
      throw new AppError('Member not found.', 404);
    }

    sendSuccess(res, member, 'Member found.');
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;

    const whereClause: { status?: MembershipStatus } = {};

    if (status) {
      const upperStatus = String(status).toUpperCase();
      if (!Object.values(MembershipStatus).includes(upperStatus as MembershipStatus)) {
        throw new AppError(
          `Invalid status filter. Allowed values: ${Object.values(MembershipStatus).join(', ')}`,
          400
        );
      }
      whereClause.status = upperStatus as MembershipStatus;
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { checkIns: true, payments: true },
        },
      },
    });

    sendSuccess(res, members, 'Members fetched successfully.');
  } catch (error) {
    next(error);
  }
};

export const searchMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phoneNumber, qrCodeToken, telegramId, query } = req.query;

    const phone = (phoneNumber as string)?.trim() || (query as string)?.trim();
    const qrCode = (qrCodeToken as string)?.trim() || (query as string)?.trim();
    const tgId = (telegramId as string)?.trim();

    if (!phone && !qrCode && !tgId) {
      throw new AppError('Please provide a phoneNumber, qrCodeToken, telegramId, or query parameter to search.', 400);
    }

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          ...(phone ? [{ phoneNumber: phone }] : []),
          ...(qrCode ? [{ qrCodeToken: qrCode }] : []),
          ...(tgId ? [{ telegramId: tgId }] : []),
        ],
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        checkIns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!member) {
      throw new AppError('Member not found.', 404);
    }

    sendSuccess(res, member, 'Member found.');
  } catch (error) {
    next(error);
  }
};
