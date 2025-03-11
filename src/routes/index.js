import { Router } from 'express';
import { forgotPassword, getUserById, getUsers, login, resetPassword, sendVerificationCode, signup, verifyVerificationCode } from '../controllers/index.js';
import authenticate from '../middlewares/authenticate.js';
import profileRoutes from './profileRoutes.js';  // Using default import

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/sendVerificationCode', sendVerificationCode);
router.post('/verifyVerificationCode', verifyVerificationCode);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.get('/users', authenticate, getUsers);
router.get('/users/:id', authenticate, getUserById);
router.use('/profiles', profileRoutes); // Mount profileRoutes under /profiles

export default router;