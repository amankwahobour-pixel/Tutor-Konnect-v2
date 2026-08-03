import { ControllerClass, RouteMiddleware } from './controller.types';

export interface Route {
    method: string;
    route: string;
    controller: ControllerClass;
    action: string;
    middleware?: RouteMiddleware[];
}