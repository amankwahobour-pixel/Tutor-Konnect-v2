// src/utils/load-env.ts
import * as path from 'node:path';
import * as dotenv from 'dotenv';

export function loadEnv() {
    const envFilePath = process.env.NODE_ENV
        ? path.resolve(__dirname, `../../environments/.env.${process.env.NODE_ENV}`)
        : path.resolve(__dirname, '../../.env');

    dotenv.config({path: envFilePath});
}