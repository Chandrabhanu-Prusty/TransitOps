import { Router } from 'express';
import { register, login, me, logout } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

// Only fleet managers can register new users
router.post('/register', authenticate, authorize([Role.fleet_manager]), register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
