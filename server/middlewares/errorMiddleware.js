import AppError from "../utils/appError.js";


export default (err, req, res, next) => {
    if (err instanceof AppError) {
        const errorResponse = err.getErrorResponse();
        res.status(err.statusCode).json(errorResponse);
    } else {
        console.error(`Unexpected Error: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
