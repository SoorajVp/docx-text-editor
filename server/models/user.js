import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of the string
        },
        given_name: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of the string
        },
        family_name: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of the string
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        picture: {
            type: String,
            enum: ['light', 'dark'], // Optional: Define theme
            default: 'light',
        },
        
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Create and export the model
const User = mongoose.model('User', userSchema);

export default User;
