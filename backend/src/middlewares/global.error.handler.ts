import {NextFunction, Request, Response} from "express";
import {ZodError} from "zod";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import logger from "../utils/logger";
import {AppError} from "../exceptions/app.error";
import {UnauthorizedError} from "../exceptions/unauthorized.error";

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err);

    // Known app errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    if (err instanceof UnauthorizedError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Zod validation errors that bubble up from service layer
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.format()
        });
    }

    // JWT errors
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: "Session expired, please log in again"
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

    // Fallback
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}