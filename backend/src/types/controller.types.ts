/**
 * Controller-related type definitions
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Route handler function type
 */
export type RouteHandler = (request: Request, response: Response, next: NextFunction) => Promise<void> | void;

/**
 * Route controller class type
 */
export type ControllerClass = new () => object;

/**
 * Route middleware function type
 */
export type RouteMiddleware = (request: Request, response: Response, next: NextFunction) => any;

/**
 * Route configuration with properly typed controller
 */
export interface TypedRoute {
  method: string;
  route: string;
  controller: ControllerClass;
  action: string;
  middleware?: RouteMiddleware[];
}
