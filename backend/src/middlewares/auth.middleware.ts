import {NextFunction, Request, Response} from "express";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // if (!req.session.userAccountId) {
    //     return res.redirect(`${getBaseUrl(req)}/login`);
    // }
    next();
}

export default isAuthenticated;
