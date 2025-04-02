import User from "../models/user.js";
import AppError from "../utils/appError.js";
import { verifyToken } from "../utils/jwt.js";

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new AppError("Unauthorized user found", 401)
        }
        const decode = verifyToken(token);
        // const isActive = await User.findOne({ _id: decode.userId, status: true })
        // if (!isActive) {
        //     throw new AppError("Unauthorized user found", 401)
        // }
        req.userId = decode.userId
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

