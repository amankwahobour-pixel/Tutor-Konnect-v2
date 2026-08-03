import z from "zod";
import {UserRole} from "../enums/entity.enums";

export interface CreateProfileDto {
    id: string;
    role?: string
    fullName: string;
    phoneNumber: string;
    profilePhoto?: string;
}

export interface UpdateProfileDto {
    fullName: string;
    phoneNumber: string;
    profilePhoto?: string;
}

interface Profile {
    id: string;
    full_name: string;
    role?: UserRole;
    phone_number: string;
    profile_photo?: string;
}

export const mapTutorEntity = (data: CreateProfileDto): Profile => {
    return {
        id: data.id,
        full_name: data.fullName,
        role: UserRole.TUTOR,
        phone_number: data.phoneNumber,
        profile_photo: data.profilePhoto,
    };
};

export const mapStudentEntity = (data: CreateProfileDto): Profile => {
    return {
        id: data.id,
        full_name: data.fullName,
        role: UserRole.STUDENT,
        phone_number: data.phoneNumber,
        profile_photo: data.profilePhoto,
    };
};


export const profileSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    profilePhoto: z.string().optional(),
    phoneNumber: z.string().min(10).max(13)
});