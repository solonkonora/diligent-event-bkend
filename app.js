import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongo-connection.js"; // assumes you're exporting a function
// import bookingRoutes from "./routes/bookings.js";     // optional: your API routes

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://your-frontend.vercel.app', credentials: true }));

app.get('/', (req, res) => res.send("✅ App is running"));

// app.use('/api/bookings', bookingRoutes); // optional: add routes

app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
