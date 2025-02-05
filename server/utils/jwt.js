import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

// Token Services
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
}

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
    } catch (err) {
        throw new AppError('Unauthorized: Invalid token', 401);
    }
}