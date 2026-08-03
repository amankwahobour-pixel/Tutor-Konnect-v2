import {format} from 'winston';

export const jsonFormat = format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    format.json()
);

export const devFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({level, message, timestamp, ...meta}) => {
        return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
);