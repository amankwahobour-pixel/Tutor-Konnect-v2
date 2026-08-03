import {Route} from "../types/route";
import {uploadPdf} from "../middlewares/multer.middleware";
import {DocumentStorageController} from "../controllers/document.storage.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const routesConfig = [
    {
        method: "post",
        route: "/api/users/:userId/documents",
        action: "uploadDocument",
        middleware: [uploadPdf.single("document")],
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/users/:userId/documents",
        action: "getDocuments",
        version: 'v1',
    },
    {
        method: "get",
        route: "/api/users/:userId/documents/:fileName",
        action: "getDocumentUrl",
        version: 'v1',
    },
    {
        method: "delete",
        route: "/api/users/:userId/documents/:fileName",
        action: "deleteDocument",
        version: 'v1',
    }
]

//Map configurations to routes
export const DocumentRoutes: Route[] = routesConfig.map(
    ({method, route, action, middleware = [isAuthenticated], version = 'v1'}) => ({
        method: method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: DocumentStorageController,
        action: action,
        middleware: middleware,
    })
);