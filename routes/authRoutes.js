import express from 'express'
import { login, logout, sendVerifyOTP, signUp, isAuthenticated } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAith, sendVerifyOTP);
authRouter.post('/send-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);

export default authRouter;