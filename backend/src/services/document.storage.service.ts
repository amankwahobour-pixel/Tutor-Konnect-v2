import {supabase} from "../configs/supabase.client";
import {ResponseSpec} from "../types/response.spec";
import {AppError} from "../exceptions/app.error";

export class DocumentStorageService {
    async uploadDocument(userId: string, file: Buffer, fileName: string): Promise<ResponseSpec> {
        const path = `users/${userId}/documents/${fileName}`;
        const {error} = await supabase.storage
            .from('documents')
            .upload(path, file, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            throw new AppError(error.message, 400);
        }

        const {data} = supabase.storage
            .from('documents')
            .getPublicUrl(path);

        return {success: true, message: "Document uploaded successfully", data: {url: data.publicUrl}};
    }
    async deleteDocument(userId: string, fileName: string): Promise<ResponseSpec> {
        const path = `users/${userId}/documents/${fileName}`;

        const {error} = await supabase.storage
            .from('documents')
            .remove([path]);

        if (error) {
            throw new AppError(error.message, 400);
        }

        return {success: true, message: "Document deleted successfully"};
    }

    async getDocumentUrl(userId: string, fileName: string): Promise<ResponseSpec> {
        const path = `users/${userId}/documents/${fileName}`;

        const {data} = supabase.storage
            .from('documents')
            .getPublicUrl(path);

        return {success: true, message: "Document URL retrieved", data: {url: data.publicUrl}};
    }
    async listDocuments(userId: string): Promise<ResponseSpec> {
        const {data, error} = await supabase.storage
            .from('documents')
            .list(`users/${userId}/documents`);

        if (error) {
            throw new AppError(error.message, 400);
        }
        const sanitized = data.map(file => ({
            fileName: file.name,
            mimeType: file.metadata?.mimetype
        }));
        return {success: true, data: sanitized};
    }
}