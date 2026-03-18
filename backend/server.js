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

const app = express();
const PORT = process.env.PORT || 5000;

// 1. ULTIMATE CORS CONFIG (MIRACLE MODE)
const corsOptions = {
    origin: function(origin, callback) {
        // Mirror the incoming origin to satisfy credentials: true requirement
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Apply CORS to ALL requests immediately
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2. Global Request Logger (For Render Debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

// 3. Standard Middlewares
app.use(express.json());
app.use(cookieParser());

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('FitLife AI API is running and CORS is active! 🚀');
});

app.use(notFound);
app.use(errorHandler);

// 5. Start Server First, Then Connect DB
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 CORS allowed for all origins with credentials`);
    
    // Connect to Database after server is up
    try {
        await connectDB();
    } catch (err) {
        console.error('❌ Delayed MongoDB Connection Error:', err.message);
    }
});
