import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'fitlife-ai',
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        console.log('⚠️  Server will continue without database. Please check your MongoDB Atlas IP whitelist.');
    }
};

export default connectDB;
