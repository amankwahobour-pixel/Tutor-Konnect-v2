import {NextFunction, Request, Response} from "express";
import {RequestParam} from "../types/request.param";
import {DocumentStorageService} from "../services/document.storage.service";

export class DocumentStorageController {

    private readonly documentService = new DocumentStorageService();

    async uploadDocument(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }

            const file = request.file;
            if (!file) {
                return response.status(400).json({success: false, message: "No file provided"});
            }

            if (file.mimetype !== 'application/pdf') {
                return response.status(400).json({success: false, message: "Only PDF files are allowed"});
            }

            const result = await this.documentService.uploadDocument(userId, file.buffer, file.originalname);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteDocument(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId, fileName}: RequestParam = request.params;
            if (!userId || !fileName) {
                return response.status(400).json({success: false, message: "User ID and file name are required"});
            }

            const result = await this.documentService.deleteDocument(userId, fileName);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async getDocumentUrl(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId, fileName}: RequestParam = request.params;
            if (!userId || !fileName) {
                return response.status(400).json({success: false, message: "User ID and file name are required"});
            }
            const result = await this.documentService.getDocumentUrl(userId, fileName);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async getDocuments(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }

            const result = await this.documentService.listDocuments(userId);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}