import os from "node:os";
import {Request} from "express";

export function getLocalExternalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        if (!iface) continue;
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address;
            }
        }
    }
    return 'localhost'; // fallback
}

export function getBaseUrl(req: Request) {

    if (process.env.NODE_ENV === 'prod') {
        return `${req.protocol}://${req.hostname}`;
    } else {
        return `${req.protocol}://${req.hostname}:${process.env.PORT}`;
    }
}