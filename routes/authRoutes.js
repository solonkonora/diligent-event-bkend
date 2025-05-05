import express from 'express'
import { login, logout, sendVerifyOTP, signUp, isAuthenticated, sendResetOTP, resetPassword } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOTP);
authRouter.post('/send-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', userAuth, sendResetOTP);
authRouter.post('/reset-password', userAuth, resetPassword);

export default authRouter;