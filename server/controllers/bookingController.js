import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { clerkClient } from "@clerk/express";
import axios from 'axios';
// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export default checkSeatsAvailability;


export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // Get authenticated user's email from Clerk
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: "Selected Seats are not available." });
    }

    const showData = await Show.findById(showId).populate('movie');

    // Create unpaid booking first
    const amount = showData.showPrice * selectedSeats.length;
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      isPaid: false,
      bookedSeats: selectedSeats
    });

    // Update occupied seats
    const updatedOccupiedSeats = { ...showData.occupiedSeats };
    selectedSeats.forEach(seat => {
      updatedOccupiedSeats[seat] = userId;
    });
    showData.occupiedSeats = updatedOccupiedSeats;

    try {
      showData.markModified("occupiedSeats");
      await showData.save({ validateBeforeSave: true });
    } catch (err) {
      console.error("❌ Error saving show:", err.message);
      return res.json({ success: false, message: "Failed to save booking details." });
    }

    // Prepare Chapa payment
    const tx_ref = booking._id.toString();
    booking.tx_ref = tx_ref;
    await booking.save();

    const chapaResponse = await axios.post(
      process.env.CHAPA_PAYMENT_URL,
      {
        amount,
        currency: 'ETB',
        email,
        tx_ref,
         callback_url: 'https://hibret-movie-ticket-booking.vercel.app/api/payment/callback', // BACKEND: Chapa notifies your server here
         return_url: `${origin}/my-bookings`,
        customizations: {
          title: showData.movie.title,
          description: `Booking for ${selectedSeats.length} seat(s)`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const paymentUrl = chapaResponse.data?.data?.checkout_url;

    return res.json({
      success: true,
      message: "Booking created. Redirect to payment.",
      paymentUrl,
      bookingId: booking._id
    });
  } catch (error) {
    console.error("Booking error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};


export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const showData = await Show.findById(showId);
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});

    res.json({ success: true, occupiedSeats });
  } catch (error) {
        return res.json({ success: false, message: error.message });
  }
};
