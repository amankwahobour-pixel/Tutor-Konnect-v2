import {createLogger, transports} from 'winston';
import {jsonFormat} from './formats';

export const prodLogger = createLogger({
    level: 'info',
    defaultMeta: {
        service: 'tutor-konnect',
        env: process.env.NODE_ENV || 'production'
    },
    transports: [

        new transports.Console({
            format: jsonFormat
        })
    ]
});