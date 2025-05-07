import bookingModel from '../models/bookingModel.js';
import userModel from '../models/userModel.js'; 

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find().populate('user', 'name email'); // populate if needed
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Respond to a booking (e.g., mark as confirmed, rejected, etc.)
export const respondToBooking = async (req, res) => {
  const { bookingId, responseStatus, adminNote } = req.body;

  if (!bookingId || !responseStatus) {
    return res.status(400).json({ success: false, message: 'Booking ID and response status are required.' });
  }

  try {
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = responseStatus; // e.g., 'confirmed', 'rejected'
    booking.adminNote = adminNote || '';
    await booking.save();

    return res.json({ success: true, message: 'Booking updated successfully', booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
