import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from '@prisma/client';
export interface CreateFinancialReportDto {
    projectId: string;
    reportType: ReportType;
    title: string;
    description?: string;
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
}
export declare class FinancialReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    createFinancialReport(userId: string, data: CreateFinancialReportDto): Promise<{
        id: string;
        projectId: string;
        reportType: import(".prisma/client").$Enums.ReportType;
        title: string;
        description: string;
        file: {
            id: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            url: string;
            uploadedAt: string;
        };
        uploadedBy: string;
        uploadedAt: string;
        status: "APPROVED";
    }>;
    getFinancialReportsByProject(projectId: string, userId: string): Promise<{
        id: string;
        projectId: string;
        reportType: import(".prisma/client").$Enums.ReportType;
        title: string;
        description: string;
        file: {
            id: string;
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            url: string;
            uploadedAt: string;
        };
        uploadedBy: string;
        uploadedAt: string;
        status: "APPROVED";
    }[]>;
    getMyFinancialReports(userId: string): Promise<any[]>;
    deleteFinancialReport(reportId: string, userId: string): Promise<{
        success: boolean;
    }>;
}
