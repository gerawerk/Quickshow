import Booking from '../models/Booking.js';
import User from '../models/user.js';
import Show from '../models/Show.js';
import nodemailer from 'nodemailer';

// 1. Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  port: 465,
  secure: false,
});

export const reminderScheduler = (bookingId, userId) => {
  // 🔔 Send reminder after 1 min
  setTimeout(async () => {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.paid) return;

      const user = await User.findById(userId);
      if (!user?.email) return;

      const email = user.email;

      // 2. Send reminder email
      await transporter.sendMail({
        from: `"Cinema Reminder" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '⏰ Reminder: Complete Your Booking Payment',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>🎟️ Don’t Miss Your Booking!</h2>
            <p>Hello,</p>
            <p>You’ve started a booking but haven’t completed the payment yet.</p>
            <p><strong>Your booking will expire in 1 minute.</strong></p>
            <a href="http://localhost:5173/my-bookings"
               style="display: inline-block; margin-top: 12px; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Complete Payment
            </a>
          </div>
        `,
      });

      console.log(`Reminder email sent to ${email}`);
    } catch (err) {
      console.error('Error sending reminder email:', err);
    }
  }, 1 * 60 * 1000); // 1 min delay

  setTimeout(async () => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.isPaid) return;

    if (!booking.bookedSeats || !Array.isArray(booking.bookedSeats)) {
      console.warn(`No bookedSeats found in booking ${booking._id}`);
      return;
    }

    const show = await Show.findById(booking.show);
    if (!show || !show.occupiedSeats) {
      console.warn(`Show not found or has no occupiedSeats: ${booking.show}`);
      return;
    }

    booking.bookedSeats.forEach(seat => {
      const trimmedSeat = seat.trim(); // Ensure no extra whitespace
      if (show.occupiedSeats.hasOwnProperty(trimmedSeat)) {
        delete show.occupiedSeats[trimmedSeat];
      } else {
        console.warn(`⚠️ Seat ${trimmedSeat} not found in occupiedSeats`);
      }
    });
      show.markModified('occupiedSeats');

    await show.save();
    await Booking.findByIdAndDelete(booking._id);
  } catch (err) {
    console.error('❌ Error deleting unpaid booking:', err);
  }
}, 2 * 60 * 1000); // 2 minutes



};
