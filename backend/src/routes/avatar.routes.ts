import {Route} from "../types/route";
import {AvatarStorageController} from "../controllers/avatar.storage.controller";
import {uploadAvatar} from "../middlewares/multer.middleware";
import isAuthenticated from "../middlewares/auth.middleware";

const routesConfig = [
    {
        method: "post",
        route: "/api/users/:userId/avatar",
        action: "uploadAvatar",
        middleware: [uploadAvatar.single("avatar")],
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/users/:userId/avatar",
        action: "getAvatarUrl",
        version: 'v1',
    },
    {
        method: "delete",
        route: "/api/users/:userId/avatar",
        action: "deleteAvatar",
        version: 'v1',
    }
]

//Map configurations to routes
export const AvatarRoutes: Route[] = routesConfig.map(
    ({method, route, action, middleware = [isAuthenticated], version = 'v1'}) => ({
        method: method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: AvatarStorageController,
        action: action,
        middleware: middleware,
    })
);