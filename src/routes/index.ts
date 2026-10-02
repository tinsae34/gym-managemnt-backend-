import { Router } from 'express';
import memberRoutes from './member.routes';
import paymentRoutes from './payment.routes';
import checkinRoutes from './checkin.routes';

const router = Router();

router.use('/members', memberRoutes);
router.use('/payments', paymentRoutes);
router.use('/checkin', checkinRoutes);

export default router;
