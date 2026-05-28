import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        last_name: {
            type: String,
            trim: true,
        },

        first_name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        picture: {
            type: String,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },

        status: {
            type: Boolean,
            default: true,
        },

        lastLoginAt: {
            type: Date,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;