import { Route } from "../types/route";
import { ReviewController } from "../controllers/review.controller";
import { RouteMiddleware } from "../types/controller.types";

const routesConfig: Array<{
    method: string;
    route: string;
    action: string;
    version: string;
    middleware?: RouteMiddleware[];
}> = [
    {
        method: "get",
        route: "/api/bookings/:bookingId/review",
        action: "getReviewByBooking",
        version: "v1",
    },
    {
        method: "post",
        route: "/api/bookings/:bookingId/review",
        action: "createReview",
        version: "v1",
    },
    {
        method: "put",
        route: "/api/bookings/:bookingId/review",
        action: "updateReview",
        version: "v1",
    },
    {
        method: "get",
        route: "/api/tutors/:tutorId/reviews",
        action: "getTutorReviews",
        version: "v1",
    },
    {
        method: "get",
        route: "/api/students/:studentId/reviews",
        action: "getStudentReviews",
        version: "v1",
    },
];

export const ReviewRoutes: Route[] = routesConfig.map(
    ({ method, route, action, middleware = [], version = 'v1' }) => ({
        method,
        route: route.replace('/api/', `/api/${version}/`),
        controller: ReviewController,
        action,
        middleware,
    })
);
