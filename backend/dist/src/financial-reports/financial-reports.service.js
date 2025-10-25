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
exports.FinancialReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinancialReportsService = class FinancialReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFinancialReport(userId, data) {
        const project = await this.prisma.project.findUnique({
            where: { id: data.projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only create reports for your own projects');
        }
        const report = await this.prisma.report.create({
            data: {
                type: data.reportType,
                fileUrl: data.fileUrl,
                projectId: data.projectId,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        ownerId: true,
                    },
                },
            },
        });
        return {
            id: report.id,
            projectId: report.projectId,
            reportType: report.type,
            title: data.title,
            description: data.description,
            file: {
                id: report.id,
                filename: data.fileName || 'financial-report.pdf',
                originalName: data.fileName || 'financial-report.pdf',
                size: data.fileSize || 0,
                mimeType: data.mimeType || 'application/pdf',
                url: data.fileUrl,
                uploadedAt: report.createdAt.toISOString(),
            },
            uploadedBy: userId,
            uploadedAt: report.createdAt.toISOString(),
            status: 'APPROVED',
        };
    }
    async getFinancialReportsByProject(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                investments: {
                    where: { investorId: userId },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const hasAccess = project.ownerId === userId || project.investments.length > 0;
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this project');
        }
        const reports = await this.prisma.report.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        const reportsWithFiles = reports.map((report) => {
            const fileName = report.fileUrl.split('/').pop() || 'financial-report.pdf';
            const reportDate = report.createdAt.toLocaleDateString('en-US', {
                month: 'numeric',
                year: 'numeric'
            });
            return {
                id: report.id,
                projectId: report.projectId,
                reportType: report.type,
                title: `${report.type} Report - ${reportDate}`,
                description: `${report.type} financial report for ${report.project.title}`,
                file: {
                    id: report.id,
                    filename: fileName,
                    originalName: fileName,
                    size: 0,
                    mimeType: 'application/pdf',
                    url: report.fileUrl,
                    uploadedAt: report.createdAt.toISOString(),
                },
                uploadedBy: project.ownerId,
                uploadedAt: report.createdAt.toISOString(),
                status: 'APPROVED',
            };
        });
        return reportsWithFiles;
    }
    async getMyFinancialReports(userId) {
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            include: {
                reports: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        const allReports = [];
        for (const project of projects) {
            for (const report of project.reports) {
                const fileName = report.fileUrl.split('/').pop() || 'financial-report.pdf';
                const reportDate = report.createdAt.toLocaleDateString('en-US', {
                    month: 'numeric',
                    year: 'numeric'
                });
                allReports.push({
                    id: report.id,
                    projectId: report.projectId,
                    reportType: report.type,
                    title: `${report.type} Report - ${reportDate}`,
                    description: `${report.type} financial report for ${project.title}`,
                    file: {
                        id: report.id,
                        filename: fileName,
                        originalName: fileName,
                        size: 0,
                        mimeType: 'application/pdf',
                        url: report.fileUrl,
                        uploadedAt: report.createdAt.toISOString(),
                    },
                    uploadedBy: userId,
                    uploadedAt: report.createdAt.toISOString(),
                    status: 'APPROVED',
                });
            }
        }
        return allReports;
    }
    async deleteFinancialReport(reportId, userId) {
        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
            include: {
                project: true,
            },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        if (report.project.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own reports');
        }
        await this.prisma.report.delete({
            where: { id: reportId },
        });
        return { success: true };
    }
};
exports.FinancialReportsService = FinancialReportsService;
exports.FinancialReportsService = FinancialReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialReportsService);
//# sourceMappingURL=financial-reports.service.js.map