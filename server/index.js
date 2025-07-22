import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import  connectDB  from './configs/db.js'; // ✅ include `.js`
import { clerkMiddleware } from '@clerk/express';
import { functions, inngest } from './Inngest/index.js'; // ✅ include `.js` or correct relative path
import { serve } from "inngest/express";
import showRouter from './Routers/showRouter.js';
import bookingRouter from './Routers/bookingRouter.js';
import adminRouter from './Routers/adminRouter.js';
import userRouter from './Routers/userRoutes.js';
import paymentRouter from './Routers/paymentRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middlewares (fix missing `()` calls)
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ Connect to MongoDB (before defining routes)
await connectDB();

// ✅ Routes
app.get('/', (req, res) => res.send('Server is live!'));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user",userRouter);
app.use("/api/payment",paymentRouter);





// ✅ Listen to port
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
