import mongoose from 'mongoose';

const accessSchema = new mongoose.Schema(
    {
        // User who is granting access
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // User who receives access
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },

        // Document reference
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
            index: true,
        },

        // Access request status
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
            index: true,
        },

        // Permission level
        permission: {
            type: String,
            enum: ['read', 'write'],
            default: 'read',
        },

         enabled: {
            type: Boolean,
            default: false,
        },
        // Optional: when user responded
        respondedAt: {
            type: Date,
            default: null,
        },

        // Optional: soft delete
        deletedAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate access requests for same doc + user
accessSchema.index(
    { recipientId: 1, documentId: 1 },
    { unique: true }
);

const Access = mongoose.model('Access', accessSchema);

export default Access;