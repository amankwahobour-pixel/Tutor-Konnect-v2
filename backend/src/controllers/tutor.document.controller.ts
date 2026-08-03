import {TutorDocumentService} from "../services/tutor.document.service";
import {NextFunction, Request, Response} from "express";
import {RequestParam} from "../types/request.param";
import {tutorDocumentSchema, tutorDocumentSchema_} from "../mappers/tutor.document.mapper";

export class TutorDocumentController {

    private readonly tutorDocumentService = new TutorDocumentService()

    async createTutorDocument(request: Request, response: Response, next: NextFunction) {
        try {
            const parsed = tutorDocumentSchema.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }
            const result = await this.tutorDocumentService.createTutorDocument(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateTutorDocument(request: Request, response: Response, next: NextFunction) {
        try {
            const {docId}: RequestParam = request.params;
            if (!docId) {
                return response.status(400).json({success: false, message: "Document ID is required"});
            }
            const parsed = tutorDocumentSchema_.safeParse(request.body);
            if (!parsed.success) {
                return response.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }
            let results = await this.tutorDocumentService.updateTutorDocument(docId, parsed.data);
            return response.status(200).json(results);
        } catch (e) {
            next(e)
        }
    }

    async getTutorDocuments(request: Request, response: Response, next: NextFunction) {
        try {
            const {docId}: RequestParam = request.params;
            if (!docId) {
                return response.status(400).json({success: false, message: "Document ID is required"});
            }
            const result = await this.tutorDocumentService.getTutorDocuments(docId);
            return response.status(200).json(result);
        } catch (e) {
            next(e)
        }
    }

    async deleteTutorDocument(request: Request, response: Response, next: NextFunction) {
        try {
            const {docId}: RequestParam = request.params;
            if (!docId) {
                return response.status(400).json({success: false, message: "Document ID is required"});
            }
            const result = await this.tutorDocumentService.deleteTutorDocument(docId);
            return response.status(200).json(result);
        } catch (e) {
            next(e)
        }
    }
}