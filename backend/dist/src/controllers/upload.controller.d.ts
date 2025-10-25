import { UploadService } from '../upload/upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadKycDocuments(files: Express.Multer.File[]): Promise<{
        message: string;
        files: Array<{
            originalName: string;
            filename: string;
            url: string;
            size: number;
            mimetype: string;
        }>;
    }>;
    uploadTransferProof(file: Express.Multer.File): Promise<{
        message: string;
        file: {
            originalName: string;
            filename: string;
            url: string;
            size: number;
            mimetype: string;
        };
    }>;
    uploadProspectus(file: Express.Multer.File): Promise<{
        message: string;
        url: string;
        filename: string;
        size: number;
        mimetype: string;
    }>;
}
