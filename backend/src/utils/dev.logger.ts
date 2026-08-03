import {createLogger, transports} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import {devFormat, jsonFormat} from './formats';

export const devLogger = createLogger({
    level: 'debug',
    defaultMeta: {
        service: 'tutor-konnect',
        env: 'development'
    },
    transports: [
        new transports.Console({
            format: devFormat
        }),

        // Local debug logs (short retention)
        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '3d',
            level: 'debug',
            format: jsonFormat
        }),

        // Errors kept longer
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '14d',
            level: 'error',
            format: jsonFormat
        })
    ]
});