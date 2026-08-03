import {AppError} from "./app.error";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class PhoneNumberAlreadyExistsError extends AppError {
    constructor(message = "Phone number already exists") {
        super(message, 409);
    }
}

export class TutorProfileAlreadyExistsError extends AppError {
    constructor(message = "Tutor profile already exists for this user") {
        super(message, 409);
    }
}