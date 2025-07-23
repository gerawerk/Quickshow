// routes/payment.routes.js
import express from 'express';
import { chapaCallback } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.get('/callback', chapaCallback);

export default paymentRouter;
