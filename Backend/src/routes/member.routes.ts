import { Router } from 'express';
import {
  createMember,
  getMembers,
  getMemberById,
  searchMembers,
} from '../controllers/member.controller';

const router = Router();

// Search endpoint must be defined before any param routes if any
router.get('/search', searchMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.get('/', getMembers);

export default router;
