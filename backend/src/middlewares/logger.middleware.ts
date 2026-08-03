// src/middleware/logger.middleware.ts
import {NextFunction, Request, Response} from 'express';
import logger from "../utils/logger";


export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const duration = Date.now() - start;
    res.on('finish', () => {
        logger.info(JSON.stringify({
            user: {},
            request: {method: req.method, statusCode: res.statusCode, url: req.originalUrl, duration: duration,},
            env: process.env.NODE_ENV,
        }));
    });
    next();
};
