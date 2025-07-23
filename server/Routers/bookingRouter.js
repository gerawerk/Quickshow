import express from "express";
import { createBooking, getOccupiedSeats, reInitiatePayment } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking );
bookingRouter.get('/seats/:showId', getOccupiedSeats );
bookingRouter.post('/pay/:bookingId', reInitiatePayment);

export default bookingRouter;