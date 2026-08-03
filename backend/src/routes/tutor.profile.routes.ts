import {Route} from "../types/route";
import {TutorProfileController} from "../controllers/tutor.profile.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const routesConfig = [
    // =========================
    // READ ROUTES (GET)
    // =========================
    {
        method: "get",
        route: "/api/tutors",
        action: "getTutors",
        version: "v1",
    },
    {
        method: "get",
        route: "/api/tutors/:userId",
        action: "getTutorProfile",
        version: "v1",
        middleware: [isAuthenticated],
    },
    {
        method: "get",
        route: "/api/tutors/:userId/earnings",
        action: "getTotalEarnings",
        version: "v1",
    },

    // =========================
    // WRITE ROUTES (CREATE)
    // =========================
    {
        method: "post",
        route: "/api/tutors",
        action: "createTutorProfile",
        version: "v1",
    },

    // =========================
    // UPDATE ROUTES
    // =========================
    {
        method: "put",
        route: "/api/tutors/:userId",
        action: "updateTutorProfile",
        version: "v1",
    },
    {
        method: "patch",
        route: "/api/tutors/:userId/field",
        action: "updateTutorProfilePartial",
        version: "v1",
    },
];

//Map configurations to routes
export const TutorProfileRoutes: Route[] = routesConfig.map(
    ({method, route, action, middleware = [isAuthenticated], version = 'v1'}) => ({
        method: method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: TutorProfileController,
        action: action,
        middleware: middleware,
    })
);