import {AvatarStorageService} from "../services/avatar.storage.service";
import {NextFunction, Request, Response} from "express";
import {RequestParam} from "../types/request.param";

export class AvatarStorageController {

    private readonly storageService = new AvatarStorageService();

    async uploadAvatar(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            const file = request.file;

            if (!file) {
                return response.status(400).json({success: false, message: "No file provided"});
            }

            const result = await this.storageService.uploadAvatar(userId, file.buffer, file.mimetype);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteAvatar(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            const result = await this.storageService.deleteAvatar(userId);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async getAvatarUrl(request: Request, response: Response, next: NextFunction) {
        try {
            const {userId}: RequestParam = request.params;
            if (!userId) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            const result = await this.storageService.getAvatarUrl(userId);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}