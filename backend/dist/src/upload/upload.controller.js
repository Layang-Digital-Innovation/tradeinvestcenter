"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const upload_service_1 = require("./upload.service");
const multerOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/kyc',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = (0, path_1.extname)(file.originalname);
            const filename = `kyc-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
            callback(null, true);
        }
        else {
            callback(new Error('Only image files (JPG, JPEG, PNG) and PDF are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadKycDocuments(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const uploadedFiles = files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            url: this.uploadService.getFileUrl(file.filename),
            size: file.size,
            mimetype: file.mimetype,
        }));
        return {
            message: 'Files uploaded successfully',
            files: uploadedFiles,
        };
    }
    async uploadTransferProof(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return {
            message: 'Transfer proof uploaded successfully',
            file: {
                originalName: file.originalname,
                filename: file.filename,
                url: this.uploadService.getTransferProofFileUrl(file.filename),
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }
    async uploadProspectus(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return {
            message: 'Prospectus uploaded successfully',
            url: this.uploadService.getProspectusFileUrl(file.filename),
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
    async uploadFinancialReport(file, req) {
        console.log('Financial report upload endpoint reached');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('File received:', file);
        console.log('User from request:', req.user);
        if (!file) {
            console.log('No file found in request');
            throw new common_1.BadRequestException('No file uploaded');
        }
        console.log('File upload successful, returning response');
        return {
            message: 'Financial report uploaded successfully',
            url: this.uploadService.getFinancialReportFileUrl(file.filename),
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
    async uploadProductImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const uploadedFiles = files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            url: this.uploadService.getProductImageUrl(file.filename),
            size: file.size,
            mimetype: file.mimetype,
        }));
        return {
            message: 'Product images uploaded successfully',
            files: uploadedFiles,
        };
    }
    async uploadCompanyLogo(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return {
            message: 'Company logo uploaded successfully',
            file: {
                originalName: file.originalname,
                filename: file.filename,
                url: this.uploadService.getCompanyLogoUrl(file.filename),
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }
    async uploadCompanyProfile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return {
            message: 'Company profile uploaded successfully',
            file: {
                originalName: file.originalname,
                filename: file.filename,
                url: this.uploadService.getCompanyProfileFileUrl(file.filename),
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('kyc'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, multerOptions)),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadKycDocuments", null);
__decorate([
    (0, common_1.Post)('transfer-proof'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/transfer-proof',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `transfer-proof-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                callback(null, true);
            }
            else {
                callback(new Error('Only image files (JPG, JPEG, PNG) and PDF are allowed!'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadTransferProof", null);
__decorate([
    (0, common_1.Post)('prospectus'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/prospectus',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `prospectus-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype === 'application/pdf') {
                callback(null, true);
            }
            else {
                callback(new Error('Only PDF files are allowed!'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProspectus", null);
__decorate([
    (0, common_1.Post)('financial-report'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/financial-reports',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `financial-report-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype === 'application/pdf') {
                callback(null, true);
            }
            else {
                callback(new Error('Only PDF files are allowed!'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFinancialReport", null);
__decorate([
    (0, common_1.Post)('product-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/product-images',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `product-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                callback(null, true);
            }
            else {
                callback(new Error('Only image files (JPG, JPEG, PNG) and PDF are allowed!'), false);
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProductImages", null);
__decorate([
    (0, common_1.Post)('company-logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (new upload_service_1.UploadService()).getCompanyLogoMulterOptions())),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadCompanyLogo", null);
__decorate([
    (0, common_1.Post)('company-profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (new upload_service_1.UploadService()).getCompanyProfileMulterOptions())),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadCompanyProfile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map