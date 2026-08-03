import {AppDataSource} from "../configs/data-source";
import {TutorProfile} from "../entities/tutor.profile";
import {ResponseSpec} from "../types/response.spec";
import {NotFoundError, TutorProfileAlreadyExistsError} from "../exceptions/unauthorized.error";
import {
    CreateTutorProfileDto,
    mapTutorProfileEntity,
    PartialTutorProfileDto,
    UpdateTutorProfileDto
} from "../mappers/tutor.profile.mapper";

export class TutorProfileService {

    private readonly tutorProfileRepository = AppDataSource.getRepository(TutorProfile);

    async getTotalEarnings(userId: string): Promise<ResponseSpec> {
        let result = await this.tutorProfileRepository
            .createQueryBuilder("tp")
            .select("tp.total_earned", "total_earnings")
            .addSelect("tp.total_sessions", "total_sessions")
            .where("tp.user_id = :userId", {userId})
            .getRawOne();
        return {success: true, data: result};
    }

    async getTutorProfile(userId: string): Promise<ResponseSpec> {
        const profile = await this.tutorProfileRepository.findOne({
            where: {user: {id: userId}}
        });

        if (!profile) {
            throw new NotFoundError();
        }
        return {success: true, data: profile};
    }

    async createTutorProfile(profile: CreateTutorProfileDto): Promise<ResponseSpec> {
        const existing = await this.tutorProfileRepository.findOne({
            where: {user: {id: profile.userId}}
        });

        if (existing) {
            throw new TutorProfileAlreadyExistsError();
        }

        let entity = mapTutorProfileEntity(profile)
        const newProfile = await this.tutorProfileRepository.save(entity);

        return {success: true, message: "Tutor profile created successfully", data: newProfile.user};
    }

    async updateTutorProfilePartial(userId: string, profile: PartialTutorProfileDto): Promise<ResponseSpec> {
        const existing = await this.tutorProfileRepository.findOne({
            where: {user: {id: userId}}
        });

        if (!existing) {
            throw new NotFoundError();
        }

        let row = await this.tutorProfileRepository.createQueryBuilder()
            .update(TutorProfile)
            .set({[profile.field]: profile.value})
            .where("user_id = :userId", {userId})
            .execute();

        return {success: true, message: "Tutor profile updated successfully", data: row.affected};
    }

    async updateTutorProfile(userId: string, profile: UpdateTutorProfileDto): Promise<ResponseSpec> {
        const existing = await this.tutorProfileRepository.findOne({
            where: {user: {id: userId}}
        });

        if (!existing) {
            throw new NotFoundError();
        }

        const payload = {
            ...existing,
            bio: profile.bio ?? existing.bio,
            availability_notes: profile.availability_notes ?? existing.availability_notes,
            hourly_rate: profile.hourly_rate ?? existing.hourly_rate,
            qualifications: profile.qualifications ?? existing.qualifications,
            subjects: profile.subjects ?? existing.subjects,
        };


        const updated = await this.tutorProfileRepository.save(payload);

        return {success: true, message: "Tutor profile updated successfully", data: updated.user};
    }

    async getTutors(subject?: string): Promise<ResponseSpec> {
        let tutors;

        if (!subject) {
            tutors = await this.tutorProfileRepository.find();
        } else {
            tutors = await this.tutorProfileRepository
                .createQueryBuilder("tp")
                .where("array_to_string(tp.subjects, ',') ILIKE :subject", {
                    subject: `%${subject}%`
                })
                .getMany();
        }

        const filtered = tutors.map(t => ({
            id: t.id,
            bio: t.bio,
            subjects: t.subjects,
            hourly_rate: t.hourly_rate,
            qualifications: t.qualifications,
            availability_notes: t.availability_notes
        }));

        return {success: true, data: filtered};
    }
}