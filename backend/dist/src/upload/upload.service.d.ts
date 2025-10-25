export declare class UploadService {
    private readonly uploadPath;
    private readonly transferProofPath;
    private readonly prospectusPath;
    private readonly financialReportsPath;
    private readonly productImagesPath;
    private readonly companyLogosPath;
    private readonly companyProfilesPath;
    constructor();
    getMulterOptions(): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, callback: any) => void;
        limits: {
            fileSize: number;
        };
    };
    deleteFile(filename: string): Promise<void>;
    getFileUrl(filename: string): string;
    getTransferProofMulterOptions(): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, callback: any) => void;
        limits: {
            fileSize: number;
        };
    };
    getTransferProofFileUrl(filename: string): string;
    deleteTransferProofFile(filename: string): Promise<void>;
    getProspectusFileUrl(filename: string): string;
    deleteProspectusFile(filename: string): Promise<void>;
    getFinancialReportFileUrl(filename: string): string;
    deleteFinancialReportFile(filename: string): Promise<void>;
    getProductImagesMulterOptions(): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, callback: any) => void;
        limits: {
            fileSize: number;
        };
    };
    getProductImageUrl(filename: string): string;
    deleteProductImageFile(filename: string): Promise<void>;
    getCompanyLogoMulterOptions(): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, callback: any) => void;
        limits: {
            fileSize: number;
        };
    };
    getCompanyLogoUrl(filename: string): string;
    getCompanyProfileMulterOptions(): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, callback: any) => void;
        limits: {
            fileSize: number;
        };
    };
    getCompanyProfileFileUrl(filename: string): string;
}
