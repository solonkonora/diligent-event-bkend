import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongo-connection.js"; 
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
// import bookingRoutes from "./routes/bookings.js";     // optional: your API routes

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

const allowedOrigins = [
    'http://localhost:3000',
    'https://diligent-events-git-development-norasolonkos-projects.vercel.app/' // the vercel deployment link
];

app.use(express.json());
app.use(cookieParser());
// CORS configuration
app.use(cors({
    origin: allowedOrigins,
    credentials: true // Allow cookies to be sent
}));

app.get('/', (req, res) => res.send("✅ App is running"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// app.use('/api/bookings', bookingRoutes); // optional: add routes

app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
