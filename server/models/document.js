import mongoose from 'mongoose';

// Define the schema for the User model
const documentSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of the string
        },
        file_name: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of the string
        },
        mime_type: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of the string
        },
        size: {
            type: Number,
            required: true
        },
        url: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Create and export the model
const Document = mongoose.model('Document', documentSchema);

export default Document;
