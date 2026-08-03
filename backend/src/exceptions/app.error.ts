export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    message: string;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}