import z from "zod";

export interface CreateTutorProfileDto {
    userId: string
    bio: string;
    qualifications: string;
    subjects?: string[];
    availability_notes?: string;
    hourly_rate?: number;
}

export interface UpdateTutorProfileDto {
    bio: string;
    qualifications: string;
    subjects?: string[];
    availability_notes?: string;
    hourly_rate?: number;
}

export interface PartialTutorProfileDto {
    field: string;
    value: string | number;
}

interface TutorProfile {
    user: { id: string }
    bio: string;
    qualifications: string;
    subjects?: string[];
    availability_notes?: string;
    hourly_rate?: number;
}


export const mapTutorProfileEntity = (data: CreateTutorProfileDto): TutorProfile => {
    // @ts-ignore
    return {
        user: {id: data.userId},
        bio: data.bio,
        availability_notes: data.availability_notes,
        hourly_rate: data.hourly_rate,
        qualifications: data.qualifications,
        subjects: data.subjects
    };
};


export const createTutorProfileSchema = z.object({
    userId: z.uuid(),
    bio: z.string().min(1, "Bio is required"),
    qualifications: z.string().min(1, "Qualifications are required"),
    subjects: z.array(z.string()).optional(),
    availability_notes: z.string().optional(),
    hourly_rate: z.coerce.number().positive().optional(),
});

export const updateTutorProfileSchema = z.object({
    bio: z.string().min(1, "Bio is required"),
    qualifications: z.string().min(1, "Qualifications are required"),
    subjects: z.array(z.string()).optional(),
    availability_notes: z.string().optional(),
    hourly_rate: z.coerce.number().positive().optional(),
});

export const partialTutorProfileSchema = z.object({
    field: z.string().min(1, "Field is required"),
    value: z.union([
        z.string(),
        z.number()
    ])
});