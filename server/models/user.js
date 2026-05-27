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

        givenName: {
            type: String,
            trim: true,
        },

        familyName: {
            type: String,
            trim: true,
        },

        username: {
            type: String,
            unique: true,
            sparse: true,
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