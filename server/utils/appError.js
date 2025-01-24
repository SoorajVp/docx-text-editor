class AppError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500; // Default to Internal Server Error if no status code is provided
        Error.captureStackTrace(this, this.constructor);
    }

    getErrorResponse() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}

export default AppError;