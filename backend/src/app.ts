import {loadEnv} from "./utils/load-env";
loadEnv()
import {initializeDatabase} from "./configs/database";
import bodyParser from "body-parser";
import router from "./routes/router";
import {getLocalExternalIP} from "./utils/utils";
import logger from "./utils/logger";
import express from "express";
import {globalErrorHandler} from "./middlewares/global.error.handler";

const app = express();

const PORT = process.env.PORT || 1000;


// declare global {
//     namespace Express {
//         interface Request {useragent: useragent.Agent;
//         }
//     }
// }

// Initialize Database
initializeDatabase().then(async () => {

    // Setup Middleware
    app.disable("x-powered-by");
    app.use(bodyParser.json({limit: "5mb"}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Use Routes
    app.use(router);

    app.use(globalErrorHandler);

    // Start Server
    app.listen(PORT, () => {
        const ip = getLocalExternalIP();
        logger.info(`Express server started. Access it on:
          - Local:   http://localhost:${PORT}
          - Network: http://${ip}:${PORT}`);
    });

    logger.info("Running in environment:", process.env.NODE_ENV ?? 'prod');

}).catch((error) => console.error("Database initialization error:", error));
