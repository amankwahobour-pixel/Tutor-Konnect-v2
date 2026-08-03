import {supabase} from "../configs/supabase.client";
import {AppError} from "../exceptions/app.error";
import {ResponseSpec} from "../types/response.spec";

export class AvatarStorageService {
    async uploadAvatar(userId: string, file: Buffer, mimeType: string): Promise<ResponseSpec> {
        const path = `users/${userId}/avatar.jpg`;

        const {error} = await supabase.storage
            .from('profiles')
            .upload(path, file, {
                contentType: mimeType,
                upsert: true  // overwrite if already exists
            });

        if (error) {
            throw new AppError(error.message, 400);
        }

        const {data} = supabase.storage
            .from('profiles')
            .getPublicUrl(path);

        return {success: true, data: data.publicUrl};
    }
    async deleteAvatar(userId: string): Promise<ResponseSpec> {
        const path = `users/${userId}/avatar.jpg`;

        const {error} = await supabase.storage
            .from('profiles')
            .remove([path]);

        if (error) {
            throw new AppError(error.message, 400);
        }

        return {success: true, message: "Avatar deleted successfully"};
    }

    async getAvatarUrl(userId: string): Promise<ResponseSpec> {
        const path = `users/${userId}/avatar.jpg`;

        const {data} = supabase.storage
            .from('profiles')
            .getPublicUrl(path);

        return {success: true, data: data.publicUrl};
    }
}