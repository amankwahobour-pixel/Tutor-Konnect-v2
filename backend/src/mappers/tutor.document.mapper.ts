import z from "zod";

export interface CreateTutorDocumentDto {
    tutorId: string
    documentType: string;
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
}

export interface UpdateTutorDocumentDto {
    documentType: string;
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
}

export interface TutorDocument {
    tutorProfile: { id: string }
    document_type: string;
    file_url: string;
    file_name?: string;
    file_size?: number;
    mime_type?: string;
}


export const mapTutorDocumentEntity = (data: CreateTutorDocumentDto): TutorDocument => {
    // @ts-ignore
    return {
        tutorProfile: {id: data.tutorId},
        document_type: data.documentType,
        file_size: data.fileSize,
        file_url: data.fileUrl,
        file_name: data.fileName,
        mime_type: data.mimeType
    };
};


export const tutorDocumentSchema = z.object({
    tutorId: z.uuid(),
    fileUrl: z.url(),
    documentType: z.string(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional()
});

export const tutorDocumentSchema_ = z.object({
    fileUrl: z.url(),
    documentType: z.string(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional()
});