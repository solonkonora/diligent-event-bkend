import express from 'express';
import userAuth from '../middleware/userAuth.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getAllBookings, respondToBooking } from '../controller/adminController.js';

const adminRouter = express.Router();

// Get all bookings 
adminRouter.get('/bookings', userAuth, roleMiddleware(['admin']), getAllBookings);

// Respond to a booking
adminRouter.post('/respond', userAuth, roleMiddleware(['admin']), respondToBooking);

export default adminRouter;
