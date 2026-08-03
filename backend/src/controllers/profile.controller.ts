import {ProfileService} from "../services/profile.service";
import {Request, Response, NextFunction} from "express";
import {profileSchema} from "../mappers/profile.mapper";
import {RequestParam} from "../types/request.param";

export class ProfileController {

    private readonly profileService = new ProfileService();

    async createProfile(request: Request ,response: Response, next: NextFunction) {
        try {
            const parsed = profileSchema.safeParse(request.body);
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
            const result = await this.profileService.createProfile(parsed.data);
            return response.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateProfile(request: Request ,response: Response, next: NextFunction) {
        try {
            const {id} : RequestParam = request.params;
            if (!id) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            const parsed = profileSchema.safeParse(request.body);
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
            let results = await this.profileService.updateProfile(id, parsed.data);
            return response.status(200).json(results);
        }catch (e) {
            next(e)
        }
    }

    async getProfile(request: Request ,response: Response, next: NextFunction) {
        try {
            const {id} : RequestParam = request.params;
            if (!id) {
                return response.status(400).json({success: false, message: "User ID is required"});
            }
            const result = await this.profileService.getProfile(id);
            return response.status(200).json(result);
        }catch (e) {
            next(e)
        }
    }

    async getAll(request: Request ,response: Response, next: NextFunction){
       try {
           const result = await this.profileService.getAll();
           return  response.status(200).json(result);
       }catch (e) {
           next(e)
       }
    }

    async getAllTutors(request: Request ,response: Response, next: NextFunction){
        try {
            const result = await this.profileService.getAllTutors();
            return  response.status(200).json(result);
        }catch (e) {
            next(e)
        }
    }

    async getAllStudents(request: Request ,response: Response, next: NextFunction){
        try {
            const result = await this.profileService.getAllStudents();
            return  response.status(200).json(result);
        }catch (e) {
            next(e)
        }
    }

    async searchTutorsByName(request: Request ,response: Response, next: NextFunction){
        try {
            const {name} = request.query;
            const result = await this.profileService.searchTutorsByName(name as string);
            return  response.status(200).json(result);
        }catch (e) {
            next(e)
        }
    }
}