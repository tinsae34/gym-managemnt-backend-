import { Router } from 'express';
import {
  createMember,
  getMembers,
  searchMembers,
} from '../controllers/member.controller';

const router = Router();

// Search endpoint must be defined before any param routes if any
router.get('/search', searchMembers);
router.post('/', createMember);
router.get('/', getMembers);

export default router;
