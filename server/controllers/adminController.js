import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/user.js";


export const isAdmin =async (req,res)=>
{
res.json({success:true ,isAdmin:true})
}
export const getDashboardData = async (req, res) => {
  try {
    // Get all paid bookings
    const bookings = await Booking.find({ isPaid: true });

    // Get all upcoming shows (today or future)
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() }
    }).populate('movie');

    // Count total users
    const totalUser = await User.countDocuments();

    // Compose dashboard metrics
    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser
    };
console.log("check")
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
  

// API to get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user').populate({
      path: 'show',
      populate: { path: 'movie' }
    }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};