import { Inngest } from "inngest";
import User from "../models/user.js";
import nodemailer from "nodemailer";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name}  ${last_name}`,
      image: image_url,
    };

    await User.create(userData);
  }
);
// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData);
  }
);

// Create transporter (use your real credentials or environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  port: 465,
  secure: false,
});
export const sendBookingEmail = inngest.createFunction(
  { id: 'send-booking-confirmation-email' },
  { event: 'booking/created' },
  async ({ event }) => {
    const { userEmail, userName, movieName, bookingId, seats } = event.data;
// Create transporter (use your real credentials or environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  port: 465,
  secure: false,
});
    await transporter.sendMail({
      from: `"Movie Booking" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎟️ Booking Confirmation - Thank You for Your Purchase",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Dear ${userName},</h2>

          <p>Thank you for choosing to watch <strong>${movieName}</strong> with us.</p>

          <p>We are pleased to confirm that your booking has been successfully processed.</p>

          <p>
            <strong>Booking Details:</strong><br />
            <strong>Booking ID:</strong> ${bookingId}<br />
            <strong>Movie Title:</strong> ${movieName}<br />
            <strong>Seats Reserved:</strong> ${seats?.length > 0 ? seats.join(', ') : 'N/A'}
          </p>

          <p>
            Please arrive at the venue at least 15 minutes before the show starts to ensure a smooth seating process.
          </p>

          <p>Should you have any questions or require assistance, feel free to contact our support team.</p>

          <p>We look forward to welcoming you!</p>

          <p style="margin-top: 2rem;">Warm regards,<br />
          <strong>The Movie Booking Team</strong></p>
        </div>
      `,
    }
  
  );
  console.log("Email sent:", info.messageId);

  }
);



// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,sendBookingEmail, syncUserDeletion ,syncUserUpdation];