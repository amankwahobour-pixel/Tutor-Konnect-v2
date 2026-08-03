import {Route} from "../types/route";
import {ProfileController} from "../controllers/profile.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const routesConfig = [
    {
        method: "get",
        route: "/api/profiles/tutors",
        action: "getAllTutors",
        version: 'v1',
        middleware: [isAuthenticated],
    },
    {
        method: "get",
        route: "/api/profiles/students",
        action: "getAllStudents",
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/profiles/tutors/search",
        action: "searchTutorsByName",
        version: 'v1',
    },
    {
        method: "post",
        route: "/api/profiles",
        action: "createProfile",
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/profiles",
        action: "getAll",
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/profiles/:id",
        action: "getProfile",
        version: 'v1',
    },
    {
        method: "put",
        route: "/api/profiles/:id",
        action: "updateProfile",
        version: 'v1',
    },
    {
        method: "delete",
        route: "/api/profiles/:id",
        action: "deleteProfile",
        version: 'v1',
    },
]

//Map configurations to routes
export const ProfileRoutes: Route[] = routesConfig.map(
    ({method, route, action, middleware = [], version = 'v1'}) => ({
        method: method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: ProfileController,
        action: action,
        middleware: middleware,
    })
);