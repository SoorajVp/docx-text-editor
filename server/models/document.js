import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
        visibility: {
            type: String,
            enum: ['private', 'shared', 'public'],
            default: 'private',
            index: true,
        },

        // ✅ New field
        recipientIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],

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