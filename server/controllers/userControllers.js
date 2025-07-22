import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBooking = async (req,res)=>
{
try {
  const user =req.auth().userId;
  console.log("Authenticated User ID:", req.auth().userID);

  const booking=await Booking.find({user}).populate({
    path:"show",
    populate : {path:"movie"}
  }).sort({createdAt : -1})
res.json({ success: true, bookings: booking });

} catch (error) {
   console.error(error);
    res.json({success:false,massage:massage.error})
}
}

// API controller function to Add or Remove movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

    let updatedFavorites;

    if (!favorites.includes(movieId)) {
      updatedFavorites = [...favorites, movieId];
    } else {
      updatedFavorites = favorites.filter(item => item !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        favorites: updatedFavorites
      }
    });

    res.json({ success: true, message: "Favorite movies updated" });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};



export const getFavorites = async (req, res) => {
  try {
    console.log("here we go")
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

        const movies = await Movie.find({ _id: { $in: favorites } });
          res.json({ success: true, movies });
  } catch (error) {
    console.error('Failed to get favorites:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
