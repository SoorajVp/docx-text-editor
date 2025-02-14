import mongoose from 'mongoose';

// Define the schema for the User model
const documentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            trim: true,
        },
        file_name: {
            type: String,
            required: true,
            trim: true,
        },
        mime_type: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true
        },
        updated_urls: {
            type: [String],
        },
        url: {
            type: String,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
