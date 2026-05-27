import User from "../models/user.js";
import AppError from "../utils/appError.js";
import { verifyToken } from "../utils/jwt.js";
import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new AppError("Unauthorized user found", 401)
        }
        const decode = verifyToken(token);
        console.log('decode', decode.userId)
        const isActive = await User.findOne({ _id: decode.userId, status: true })
        if (!isActive) {
            throw new AppError("Unauthorized user found", 401)
        }
        console.log('isActive', isActive)
        req.userId = decode.userId
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const verifySharedAccess = async (req, res, next) => {
    try {
        // Default value
        req.userId = "UNAUTHORIZED_USER";

        const authHeader = req.headers.authorization;

        // No auth header
        if (!authHeader) {
            return next();
        }

        // Expected format: Bearer <token>
        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return next();
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        console.log('decoded =>', decoded);

        // Set userId if token is valid
        if (decoded?.userId) {
            req.userId = decoded.userId;
        }

        return next();

    } catch (error) {
        console.log('verifySharedAccess error =>', error.message);

        req.userId = "UNAUTHORIZED_USER";

        return next();
    }
};