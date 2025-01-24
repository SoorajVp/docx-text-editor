import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const ConnectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export default ConnectDatabase