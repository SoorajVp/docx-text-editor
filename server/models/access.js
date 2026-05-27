import mongoose from 'mongoose';


const accessSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },

    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    visibility: {
        type: String,
        enum: ['private', 'public'],
        default: 'private',
    },

    permission: {
        type: String,
        enum: ['viewer', 'editor'],
        default: 'viewer',
    },

    enabled: {
        type: Boolean,
        default: true,
    },

    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

accessSchema.index(
    {
        documentId: 1,
        recipientId: 1,
    },
    {
        unique: true,
    }
);

const Access = mongoose.model('Access', accessSchema);

export default Access;