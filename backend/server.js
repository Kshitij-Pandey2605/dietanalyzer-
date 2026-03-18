import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import connectDB from './config/db.js';

dotenv.config();

// Database Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5175',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('FitLife AI API is running...');
});

app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
