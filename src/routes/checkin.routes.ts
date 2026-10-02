import { Router } from 'express';
import { recordCheckIn } from '../controllers/checkin.controller';

const router = Router();

router.post('/', recordCheckIn);

export default router;
