import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadKycDocuments(files: Express.Multer.File[]): Promise<any>;
    uploadTransferProof(file: Express.Multer.File): Promise<any>;
    uploadProspectus(file: Express.Multer.File): Promise<any>;
    uploadFinancialReport(file: Express.Multer.File, req: any): Promise<any>;
    uploadProductImages(files: Express.Multer.File[]): Promise<any>;
    uploadCompanyLogo(file: Express.Multer.File): Promise<any>;
    uploadCompanyProfile(file: Express.Multer.File): Promise<any>;
}
