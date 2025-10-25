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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
let UploadService = class UploadService {
    constructor() {
        this.uploadPath = './uploads/kyc';
        this.transferProofPath = './uploads/transfer-proof';
        this.prospectusPath = './uploads/prospectus';
        this.financialReportsPath = './uploads/financial-reports';
        this.productImagesPath = './uploads/product-images';
        this.companyLogosPath = './uploads/company-logos';
        this.companyProfilesPath = './uploads/company-profiles';
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
        if (!fs.existsSync(this.transferProofPath)) {
            fs.mkdirSync(this.transferProofPath, { recursive: true });
        }
        if (!fs.existsSync(this.prospectusPath)) {
            fs.mkdirSync(this.prospectusPath, { recursive: true });
        }
        if (!fs.existsSync(this.financialReportsPath)) {
            fs.mkdirSync(this.financialReportsPath, { recursive: true });
        }
        if (!fs.existsSync(this.productImagesPath)) {
            fs.mkdirSync(this.productImagesPath, { recursive: true });
        }
        if (!fs.existsSync(this.companyLogosPath)) {
            fs.mkdirSync(this.companyLogosPath, { recursive: true });
        }
        if (!fs.existsSync(this.companyProfilesPath)) {
            fs.mkdirSync(this.companyProfilesPath, { recursive: true });
        }
    }
    getMulterOptions() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: this.uploadPath,
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
    }
    async deleteFile(filename) {
        const filePath = `${this.uploadPath}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getFileUrl(filename) {
        return `/uploads/kyc/${filename}`;
    }
    getTransferProofMulterOptions() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: this.transferProofPath,
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
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        };
    }
    getTransferProofFileUrl(filename) {
        return `/uploads/transfer-proof/${filename}`;
    }
    async deleteTransferProofFile(filename) {
        const filePath = `${this.transferProofPath}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getProspectusFileUrl(filename) {
        return `/uploads/prospectus/${filename}`;
    }
    async deleteProspectusFile(filename) {
        const filePath = `${this.prospectusPath}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getFinancialReportFileUrl(filename) {
        return `/uploads/financial-reports/${filename}`;
    }
    async deleteFinancialReportFile(filename) {
        const filePath = `${this.financialReportsPath}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getProductImagesMulterOptions() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: this.productImagesPath,
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
        };
    }
    getProductImageUrl(filename) {
        return `/uploads/product-images/${filename}`;
    }
    async deleteProductImageFile(filename) {
        const filePath = `${this.productImagesPath}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getCompanyLogoMulterOptions() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: this.companyLogosPath,
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = (0, path_1.extname)(file.originalname);
                    const filename = `company-logo-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Only image files (JPG, JPEG, PNG) are allowed!'), false);
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        };
    }
    getCompanyLogoUrl(filename) {
        return `/uploads/company-logos/${filename}`;
    }
    getCompanyProfileMulterOptions() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: this.companyProfilesPath,
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = (0, path_1.extname)(file.originalname);
                    const filename = `company-profile-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (file.mimetype.match(/\/(jpg|jpeg|png)$/) || file.mimetype === 'application/pdf') {
                    callback(null, true);
                }
                else {
                    callback(new Error('Only image files (JPG, JPEG, PNG) or PDF are allowed!'), false);
                }
            },
            limits: { fileSize: 10 * 1024 * 1024 },
        };
    }
    getCompanyProfileFileUrl(filename) {
        return `/uploads/company-profiles/${filename}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map