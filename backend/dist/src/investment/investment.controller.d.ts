import { StreamableFile } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { ProjectStatus, ReportType } from '@prisma/client';
import { Response } from 'express';
export declare class InvestmentController {
    private readonly investmentService;
    constructor(investmentService: InvestmentService);
    createProject(req: any, data: {
        title: string;
        description: string;
        targetAmount?: number;
        deadline?: Date | string;
        bankAccount?: string;
        bankName?: string;
        accountHolder?: string;
        profitSharingPercentage?: number;
        profitSharingPercentageAfterBEP?: number;
        minInvestment?: number;
        prospectusUrl?: string;
        prospectusFileName?: string;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    getProjects(status?: ProjectStatus): Promise<{
        totalInvestment: number;
        owner: {
            id: string;
            email: string;
        };
        investments: {
            id: string;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            amount: number;
        }[];
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }[]>;
    getProjectById(id: string): Promise<{
        totalInvestment: number;
        owner: {
            id: string;
            email: string;
        };
        investments: {
            id: string;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            createdAt: Date;
            amount: number;
            investor: {
                id: string;
                email: string;
            };
        }[];
        reports: {
            id: string;
            createdAt: Date;
            projectId: string;
            type: import(".prisma/client").$Enums.ReportType;
            fileUrl: string;
        }[];
        dividends: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        }[];
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    investInProject(req: any, projectId: string, data: {
        amount: number;
    }): Promise<{
        project: {
            title: string;
            owner: {
                email: string;
            };
        };
        investor: {
            email: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    updateProjectStatus(projectId: string, data: {
        status: ProjectStatus;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    distributeDividend(projectId: string, data: {
        amount: number;
        date: Date;
        afterBEP?: boolean;
    }): Promise<any>;
    getMyProjects(req: any): Promise<{
        totalInvestment: number;
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        targetAmount: number;
        currentAmount: number;
        minInvestment: number;
        profitSharingPercentage: number;
        profitSharingPercentageAfterBEP: number;
        prospectusUrl: string;
        prospectusFileName: string;
        deadline: Date;
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        createdAt: Date;
        updatedAt: Date;
        investments: {
            id: string;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            createdAt: Date;
            amount: number;
            investor: {
                id: string;
                email: string;
            };
        }[];
        reports: {
            id: string;
            createdAt: Date;
            projectId: string;
            type: import(".prisma/client").$Enums.ReportType;
            fileUrl: string;
        }[];
        dividends: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        }[];
        ownerId: string;
        _count: {
            investments: number;
        };
    }[]>;
    updateProject(req: any, projectId: string, data: {
        title?: string;
        description?: string;
        targetAmount?: number;
        deadline?: Date;
        minInvestment?: number;
        profitSharingPercentage?: number;
        profitSharingPercentageAfterBEP?: number;
        prospectusUrl?: string;
        prospectusFileName?: string;
        bankName?: string;
        bankAccount?: string;
        accountHolder?: string;
        progress?: number;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    updateBankAccount(req: any, projectId: string, data: {
        bankAccount: string;
        bankName: string;
        accountHolder: string;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    addFinancialReport(req: any, projectId: string, data: {
        type: ReportType;
        fileUrl: string;
        month?: number;
        year?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        type: import(".prisma/client").$Enums.ReportType;
        fileUrl: string;
    }>;
    getPortfolio(req: any): Promise<{
        totalInvested: number;
        totalDividendsReceived: number;
        pendingDividends: number;
        activeInvestments: number;
        investments: {
            investment: {
                investorShare: number;
                totalDividends: number;
                dividendsReceived: number;
                project: {
                    totalInvestment: any;
                    owner: {
                        id: string;
                        email: string;
                    };
                    investments: {
                        amount: number;
                    }[];
                    dividends: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        amount: number;
                        projectId: string;
                        date: Date;
                    }[];
                    _count: {
                        investments: number;
                    };
                    id: string;
                    title: string;
                    description: string;
                    status: import(".prisma/client").$Enums.ProjectStatus;
                    financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
                    targetAmount: number | null;
                    currentAmount: number;
                    minInvestment: number | null;
                    profitSharingPercentage: number | null;
                    profitSharingPercentageAfterBEP: number | null;
                    prospectusUrl: string | null;
                    prospectusFileName: string | null;
                    deadline: Date | null;
                    bankName: string | null;
                    accountNumber: string | null;
                    accountHolder: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    ownerId: string;
                };
                dividendDistributions: {
                    id: string;
                    status: import(".prisma/client").$Enums.DividendStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    investorId: string;
                    percentage: number;
                    dividendId: string;
                    investmentId: string;
                    paidAt: Date | null;
                    paymentProof: string | null;
                }[];
                id: string;
                status: import(".prisma/client").$Enums.InvestmentStatus;
                createdAt: Date;
                updatedAt: Date;
                amount: number;
                investorId: string;
                projectId: string;
                transferProofUrl: string | null;
                transferProofFileName: string | null;
                transferDate: Date | null;
                approvedBy: string | null;
                approvedAt: Date | null;
                rejectedReason: string | null;
                chatId: string | null;
            };
            project: {
                totalInvestment: any;
                owner: {
                    id: string;
                    email: string;
                };
                investments: {
                    amount: number;
                }[];
                dividends: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    projectId: string;
                    date: Date;
                }[];
                _count: {
                    investments: number;
                };
                id: string;
                title: string;
                description: string;
                status: import(".prisma/client").$Enums.ProjectStatus;
                financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
                targetAmount: number | null;
                currentAmount: number;
                minInvestment: number | null;
                profitSharingPercentage: number | null;
                profitSharingPercentageAfterBEP: number | null;
                prospectusUrl: string | null;
                prospectusFileName: string | null;
                deadline: Date | null;
                bankName: string | null;
                accountNumber: string | null;
                accountHolder: string | null;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
            };
            dividendsReceived: number;
            pendingDividends: number;
            roi: number;
        }[];
        availableProjects: {
            totalInvestment: number;
            owner: {
                id: string;
                email: string;
            };
            investments: {
                amount: number;
            }[];
            id: string;
            title: string;
            description: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            bankName: string | null;
            accountNumber: string | null;
            accountHolder: string | null;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
        }[];
        totalReturn: number;
        roi: number;
        activeProjects: number;
        projectBreakdown: {
            roi: number;
            projectId: string;
            projectTitle: string;
            totalInvested: number;
            totalReturn: number;
        }[];
    }>;
    getInvestmentHistory(req: any): Promise<({
        project: {
            id: string;
            title: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    })[]>;
    getDividendHistory(req: any): Promise<any[]>;
    getAllProjectsForAdmin(): Promise<({
        owner: {
            id: string;
            email: string;
        };
        investments: ({
            investor: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            investorId: string;
            projectId: string;
            transferProofUrl: string | null;
            transferProofFileName: string | null;
            transferDate: Date | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            chatId: string | null;
        })[];
        reports: {
            id: string;
            createdAt: Date;
            projectId: string;
            type: import(".prisma/client").$Enums.ReportType;
            fileUrl: string;
        }[];
        dividends: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        }[];
        _count: {
            investments: number;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    })[]>;
    getProjectStatistics(): Promise<{
        totalProjects: number;
        approvedProjects: number;
        pendingProjects: number;
        totalInvestmentAmount: number;
        totalInvestors: number;
    }>;
    getAllInvestmentsForAdmin(page?: string, limit?: string, status?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createInvestmentRequest(req: any, data: {
        projectId: string;
        chatId: string;
    }): Promise<{
        project: {
            id: string;
            title: string;
            bankName: string;
            accountNumber: string;
            accountHolder: string;
        };
        investor: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    getProjectDetailsForInvestor(req: any, projectId: string): Promise<{
        investment: {
            id: string;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            amount: number;
        };
        owner: {
            id: string;
            email: string;
        };
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    approveInvestment(req: any, investmentId: string, data?: {
        amount?: number;
    }): Promise<{
        project: {
            owner: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            title: string;
            description: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            bankName: string | null;
            accountNumber: string | null;
            accountHolder: string | null;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
        };
        investor: {
            id: string;
            email: string;
            fullname: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    rejectInvestment(req: any, investmentId: string, data: {
        rejectedReason: string;
    }): Promise<{
        project: {
            id: string;
            title: string;
        };
        investor: {
            id: string;
            email: string;
            fullname: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    getPendingInvestments(): Promise<any[]>;
    getPendingProjectsCount(): Promise<{
        count: number;
    }>;
    getMyApprovedProjects(req: any): Promise<{
        investorShare: number;
        totalDividends: number;
        project: {
            totalInvestment: number;
            owner: {
                id: string;
                email: string;
            };
            investments: {
                amount: number;
            }[];
            reports: {
                id: string;
                createdAt: Date;
                projectId: string;
                type: import(".prisma/client").$Enums.ReportType;
                fileUrl: string;
            }[];
            dividends: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                amount: number;
                projectId: string;
                date: Date;
            }[];
            id: string;
            title: string;
            description: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            bankName: string | null;
            accountNumber: string | null;
            accountHolder: string | null;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
        };
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }[]>;
    getInvestmentById(req: any, investmentId: string): Promise<{
        project: {
            owner: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            title: string;
            description: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            bankName: string | null;
            accountNumber: string | null;
            accountHolder: string | null;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
        };
        investor: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    getProjectInvestments(req: any, projectId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        transferProofUrl: string;
        transferProofFileName: string;
        transferDate: Date;
        approvedAt: Date;
        rejectedReason: string;
        investor: {
            id: string;
            email: string;
        };
    }[]>;
    previewProspectus(projectId: string, res: Response): Promise<StreamableFile>;
    downloadProspectus(projectId: string, res: Response): Promise<StreamableFile>;
}
