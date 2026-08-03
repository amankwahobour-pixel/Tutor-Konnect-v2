import {AppDataSource} from "../configs/data-source";
import {TutorDocument} from "../entities/tutor.document";
import {CreateTutorDocumentDto, mapTutorDocumentEntity, UpdateTutorDocumentDto} from "../mappers/tutor.document.mapper";
import {ResponseSpec} from "../types/response.spec";
import {NotFoundError} from "../exceptions/unauthorized.error";

export class TutorDocumentService {

    private readonly tutorDocumentRepository = AppDataSource.getRepository(TutorDocument);

    async createTutorDocument(tutorDocument: CreateTutorDocumentDto): Promise<ResponseSpec> {
        const mapped = mapTutorDocumentEntity(tutorDocument);
        const result = await this.tutorDocumentRepository.save(mapped);
        return {success: true, message: "Tutor document added successfully", data: result};
    }

    async updateTutorDocument(docId: string, tutorDocument: UpdateTutorDocumentDto): Promise<ResponseSpec> {
        const existing = await this.tutorDocumentRepository.findOne({where: {id: docId}});

        if (!existing) {
            throw new NotFoundError("Tutor document not found");
        }

        const updated = await this.tutorDocumentRepository.save({...existing, ...tutorDocument});

        return {success: true, message: "Tutor document updated successfully", data: updated.id};
    }

    async getTutorDocuments(tutorId: string): Promise<ResponseSpec> {
        const document = await this.tutorDocumentRepository.find({where: {id: tutorId}});

        if (!document) {
            throw new NotFoundError("Tutor document not found");
        }

        return {success: true, data: document};
    }

    async deleteTutorDocument(docId: string): Promise<ResponseSpec> {
        const existing = await this.tutorDocumentRepository.findOne({where: {id: docId}});

        if (!existing) {
            throw new NotFoundError("Tutor document not found");
        }
        await this.tutorDocumentRepository.remove(existing);
        return {success: true, message: "Tutor document deleted successfully"};
    }
}