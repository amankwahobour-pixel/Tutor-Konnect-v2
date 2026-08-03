import {AuthController} from "../controllers/auth.controller";
import {Route} from "../types/route";


const routesConfig = [
    {
        method: "post",
        route: "/api/auth/login",
        action: "loginWithPhone",
        middleware: [],
        version: 'v1',
    },
    {
        method: "post",
        route: "/api/auth/login",
        action: "loginWithEmail",
        version: 'v2',
    },
    {
        method: "post",
        route: "/api/auth/signup",
        action: "signUpWithEmail",
        version: 'v1',
    },
    {
        method: "post",
        route: "/api/auth/resend-email-verification",
        action: "resendEmailVerification",
        version: 'v1',
    },
    {
        method: "post",
        route: "/api/auth/verify-phone",
        action: "verifyPhoneOtp",
        version: 'v1',
    },
    {
        method: "post",
        route: "/api/auth/resend-phone-otp",
        action: "loginWithPhone",
        version: 'v1',
    },
    {
        method: "post",
        route: "/api/auth/logout",
        action: "logout",
        version: 'v1',
    }
]

//Map configurations to routes
export const AuthRoutes: Route[] = routesConfig.map(
    ({method, route, action, middleware = [], version = 'v1'}) => ({
        method: method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: AuthController,
        action: action,
        middleware: middleware,
    })
);