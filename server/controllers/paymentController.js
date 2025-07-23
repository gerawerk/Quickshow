import { inngest } from "../Inngest/index.js";
import Booking from "../models/Booking.js";

export const chapaCallback = async (req, res) => {
  try {
    const data = req.body;

    console.log("Chapa callback received:", data);

    const tx_ref = data.trx_ref;
    const status = data.status;

    if (!tx_ref) {
      return res.status(400).json({ message: "tx_ref missing in callback" });
    }

    // Fetch booking and populate user and nested movie inside show
    const booking = await Booking.findOne({ tx_ref })
      .populate("user")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "Movie",
        },
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === "success") {
      booking.isPaid = true;
      await booking.save();
      console.log(`✅ Booking ${booking._id} marked as paid.`);

      // Extract info to emit to Inngest
      const bookingId = booking._id.toString();
      const userEmail = booking.user?.email || "unknown email";
      const userName = booking.user?.name || "unknown user";
      const movieTitle = booking.show?.movie?.title || "Unknown Movie";
      const seats = booking.bookedSeats || [];

      // Emit event to Inngest for sending confirmation email
      await inngest.send({
        name: "booking/created",
        data: {
          bookingId,
          userEmail,
          userName,
          movieName: movieTitle,
          seats,
        },
      });
    } else {
      console.log(`ℹ️ Payment status for booking ${booking._id}: ${status}`);
    }

    return res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("❌ Error in Chapa callback:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
