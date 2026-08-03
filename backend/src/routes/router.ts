import * as express from "express";
import {NextFunction, Request, Response} from "express";
import {requestLogger} from "../middlewares/logger.middleware";
import {Routes} from "./routes";
import logger from "../utils/logger";

const router = express.Router();

router.use(requestLogger)

Routes.forEach((route) => {
    const routeMiddleware = route.middleware ? [route.middleware] : [];
    (router as any)[route.method](route.route, ...routeMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        logger.info(`Incoming request to ${req.originalUrl}`);
        try {
            const controllerInstance = new route.controller();
            const action = (controllerInstance as Record<string, any>)[route.action];

            if (typeof action !== "function") {
                throw new TypeError(
                    `Action '${route.action}' is not a function in controller '${route.controller.name}'`
                );
            }
            await action.call(controllerInstance, req, res, next);
        } catch (error) {
            next(error);
        }
    });
});

export default router;