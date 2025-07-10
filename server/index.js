import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db';
import { clerkMiddleware } from '@clerk/express'
import { functions, inngest } from './Inngest';
import { serve } from "inngest/express";

const app=express();
const port=3000;

//middlewares
app.use(express.json);
app.use(cors)
app.use(clerkMiddleware())

//API endpoints
await connectDB();
app.get('/',(req,res)=>res.send('Server is live!'))
app.use("/api/inngest", serve({ Client: inngest, functions }));

 
app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));
