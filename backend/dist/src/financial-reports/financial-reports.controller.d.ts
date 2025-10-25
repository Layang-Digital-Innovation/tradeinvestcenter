import { FinancialReportsService, CreateFinancialReportDto } from './financial-reports.service';
export declare class FinancialReportsController {
    private readonly financialReportsService;
    constructor(financialReportsService: FinancialReportsService);
    createFinancialReport(req: any, createReportDto: CreateFinancialReportDto): Promise<{
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
    getFinancialReportsByProject(req: any, projectId: string): Promise<{
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
    getMyFinancialReports(req: any): Promise<any[]>;
    deleteFinancialReport(req: any, reportId: string): Promise<{
        success: boolean;
    }>;
}
