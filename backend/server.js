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
const allowedOrigins = [
    'http://localhost:5175',
    'https://dietanalyzer-fitlife.netlify.app',
    'https://dietanalyzer.netlify.app',
    'https://fitlife-ai-g4ye.onrender.com', // Added actual Render URL
    process.env.FRONTEND_URL
].filter(Boolean);

// Permissive CORS for production launch
app.use(cors({
    origin: function(origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', cors()); // Handle preflight for all routes
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
