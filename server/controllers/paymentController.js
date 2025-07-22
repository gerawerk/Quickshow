// import Booking from '../models/booking.model.js';

import Booking from "../models/Booking.js";

export const chapaCallback = async (req, res) => {
  try {
    const data = req.body;

    console.log('Chapa callback received:', data);

    const tx_ref = data.tx_ref;
    const status = data.status;

    if (!tx_ref) {
      return res.status(400).json({ message: 'tx_ref missing in callback' });
    }

    const booking = await Booking.findOne({ tx_ref });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status === 'success') {
      booking.isPaid = true;
      await booking.save();
      console.log(`Booking ${booking._id} marked as paid.`);
    } else {
      console.log(`Payment status for booking ${booking._id}: ${status}`);
    }

    // Respond to Chapa that you received the callback successfully
    return res.status(200).json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('Error in Chapa callback:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
