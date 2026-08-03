import {AppDataSource} from "./data-source";
import logger from "../utils/logger"; // Assuming you have a data-source.ts

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully!");
    } catch (error) {
        logger.error("TypeORM initialization error:", error);
        throw error;
    }
}