import {AppDataSource} from "../configs/data-source";
import {Profile} from "../entities/profile";
import {CreateProfileDto, mapStudentEntity, mapTutorEntity, UpdateProfileDto} from "../mappers/profile.mapper";
import {UserRole} from "../enums/entity.enums";
import {NotFoundError, PhoneNumberAlreadyExistsError} from "../exceptions/unauthorized.error";
import {ResponseSpec} from "../types/response.spec";
import {AppError} from "../exceptions/app.error";
import {ILike} from "typeorm";

export class ProfileService {

    private readonly profileRepository =  AppDataSource.getRepository(Profile);
    async createProfile(profile: CreateProfileDto): Promise<ResponseSpec> {
        const existing = await this.profileRepository.findOne({
            where: { phone_number: profile.phoneNumber }
        });

        if (existing) {
            throw new PhoneNumberAlreadyExistsError();
        }

        const entity = profile.role === UserRole.TUTOR
            ? mapTutorEntity(profile)
            : mapStudentEntity(profile);

        const newProfile = await this.profileRepository.save(entity);

        return { success: true, message: "Profile created successfully", data: newProfile };
    }
    async updateProfile(id: string, profile: UpdateProfileDto): Promise<ResponseSpec> {

        const existing = await this.profileRepository.findOne({
            where: { id }
        });

        if (!existing) {
            throw new NotFoundError("Profile not found");
        }

        const normalizedPhone = profile.phoneNumber?.trim();

        if (
            normalizedPhone &&
            normalizedPhone !== existing.phone_number
        ) {
            const phoneTaken = await this.profileRepository.findOne({
                where: {
                    phone_number: normalizedPhone
                }
            });

            if (phoneTaken) {
                throw new PhoneNumberAlreadyExistsError();
            }
        }

        const payload = {
            ...existing,
            full_name:
                profile.fullName ?? existing.full_name,

            phone_number:
                normalizedPhone ?? existing.phone_number,

            profile_photo:
                profile.profilePhoto ?? existing.profile_photo
        };

        const updated = await this.profileRepository.save(payload);

        return {
            success: true,
            message: "Profile updated successfully",
            data: updated
        };
    }

    async getAll(): Promise<ResponseSpec> {
        const profiles = await this.profileRepository.find();
        return { success: true, data: profiles };
    }
    async getProfile(id: string): Promise<ResponseSpec> {
        const profile = await this.profileRepository.findOne({ where: { id } });

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return { success: true, data: profile };
    }

    async getAllTutors(): Promise<ResponseSpec> {
        const tutors = await this.profileRepository.find({
            where: { role: UserRole.TUTOR }
        });
        return { success: true, data: tutors };
    }

    async getAllStudents(): Promise<ResponseSpec> {
        const tutors = await this.profileRepository.find({
            where: { role: UserRole.STUDENT }
        });
        return { success: true, data: tutors };
    }
    async searchTutorsByName(name: string): Promise<ResponseSpec> {
        const tutors = await this.profileRepository.find({
            where: [
                { role: UserRole.TUTOR, full_name: ILike(`%${name}%`) }
            ]
        });

        if (!tutors.length) {
            throw new AppError("No tutors found", 404);
        }

        return { success: true, data: tutors };
    }
}