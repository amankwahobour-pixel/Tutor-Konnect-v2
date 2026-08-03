import {Route} from "../types/route";
import isAuthenticated from "../middlewares/auth.middleware";
import {TutorDocumentController} from "../controllers/tutor.document.controller";

const routesConfig = [
    {
        method: "post",
        route: "/api/tutor-documents",
        action: "createTutorDocument",
        middleware: [],
        version: 'v1',
    },
    {
        method: "put",
        route: "/api/tutor-documents/:docId",
        action: "updateTutorDocument",
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/tutor-documents/:docId",
        action: "getTutorDocuments",
        version: 'v1',
    },
    {
        method: "delete",
        route: "/api/tutor-documents/:docId",
        action: "deleteTutorDocument",
        version: 'v1',
    }
]

//Map configurations to routes
export const TutorDocumentRoutes: Route[] = routesConfig.map(
    ({method, route, action, middleware = [isAuthenticated], version = 'v1'}) => ({
        method: method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: TutorDocumentController,
        action: action,
        middleware: middleware,
    })
);