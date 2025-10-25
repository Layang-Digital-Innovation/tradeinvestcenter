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
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
    }>;
    getProjects(status?: ProjectStatus): Promise<{
        totalInvestment: number;
        investments: {
            id: string;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            amount: number;
        }[];
        owner: {
            id: string;
            email: string;
        };
        id: string;
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
    }[]>;
    getProjectById(id: string): Promise<{
        totalInvestment: number;
        investments: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            amount: number;
            investor: {
                id: string;
                email: string;
            };
        }[];
        dividends: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        }[];
        owner: {
            id: string;
            email: string;
        };
        reports: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.ReportType;
            projectId: string;
            fileUrl: string;
        }[];
        id: string;
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
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
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    updateProjectStatus(projectId: string, data: {
        status: ProjectStatus;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
    }>;
    distributeDividend(projectId: string, data: {
        amount: number;
        date: Date;
        afterBEP?: boolean;
    }): Promise<any>;
    getMyProjects(req: any): Promise<{
        totalInvestment: number;
        id: string;
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        _count: {
            investments: number;
        };
        investments: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            amount: number;
            investor: {
                id: string;
                email: string;
            };
        }[];
        dividends: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        }[];
        bankName: string;
        accountNumber: string;
        title: string;
        ownerId: string;
        targetAmount: number;
        currentAmount: number;
        minInvestment: number;
        profitSharingPercentage: number;
        profitSharingPercentageAfterBEP: number;
        prospectusUrl: string;
        prospectusFileName: string;
        deadline: Date;
        accountHolder: string;
        reports: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.ReportType;
            projectId: string;
            fileUrl: string;
        }[];
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
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
    }>;
    updateBankAccount(req: any, projectId: string, data: {
        bankAccount: string;
        bankName: string;
        accountHolder: string;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
    }>;
    addFinancialReport(req: any, projectId: string, data: {
        type: ReportType;
        fileUrl: string;
        month?: number;
        year?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        projectId: string;
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
                    _count: {
                        investments: number;
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
                    owner: {
                        id: string;
                        email: string;
                    };
                    id: string;
                    description: string;
                    createdAt: Date;
                    status: import(".prisma/client").$Enums.ProjectStatus;
                    updatedAt: Date;
                    bankName: string | null;
                    accountNumber: string | null;
                    title: string;
                    ownerId: string;
                    financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
                    targetAmount: number | null;
                    currentAmount: number;
                    minInvestment: number | null;
                    profitSharingPercentage: number | null;
                    profitSharingPercentageAfterBEP: number | null;
                    prospectusUrl: string | null;
                    prospectusFileName: string | null;
                    deadline: Date | null;
                    accountHolder: string | null;
                };
                dividendDistributions: {
                    id: string;
                    createdAt: Date;
                    status: import(".prisma/client").$Enums.DividendStatus;
                    updatedAt: Date;
                    amount: number;
                    paidAt: Date | null;
                    investorId: string;
                    percentage: number;
                    dividendId: string;
                    investmentId: string;
                    paymentProof: string | null;
                }[];
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.InvestmentStatus;
                approvedBy: string | null;
                approvedAt: Date | null;
                updatedAt: Date;
                amount: number;
                investorId: string;
                projectId: string;
                transferProofUrl: string | null;
                transferProofFileName: string | null;
                transferDate: Date | null;
                rejectedReason: string | null;
                chatId: string | null;
            };
            project: {
                totalInvestment: any;
                _count: {
                    investments: number;
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
                owner: {
                    id: string;
                    email: string;
                };
                id: string;
                description: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ProjectStatus;
                updatedAt: Date;
                bankName: string | null;
                accountNumber: string | null;
                title: string;
                ownerId: string;
                financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
                targetAmount: number | null;
                currentAmount: number;
                minInvestment: number | null;
                profitSharingPercentage: number | null;
                profitSharingPercentageAfterBEP: number | null;
                prospectusUrl: string | null;
                prospectusFileName: string | null;
                deadline: Date | null;
                accountHolder: string | null;
            };
            dividendsReceived: number;
            pendingDividends: number;
            roi: number;
        }[];
        availableProjects: {
            totalInvestment: number;
            investments: {
                amount: number;
            }[];
            owner: {
                id: string;
                email: string;
            };
            id: string;
            description: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProjectStatus;
            updatedAt: Date;
            bankName: string | null;
            accountNumber: string | null;
            title: string;
            ownerId: string;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            accountHolder: string | null;
        }[];
        totalReturn: number;
        roi: number;
        activeProjects: number;
    }>;
    getInvestmentHistory(req: any): Promise<({
        project: {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    })[]>;
    getDividendHistory(req: any): Promise<any[]>;
    getAllProjectsForAdmin(): Promise<({
        _count: {
            investments: number;
        };
        investments: ({
            investor: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            approvedBy: string | null;
            approvedAt: Date | null;
            updatedAt: Date;
            amount: number;
            investorId: string;
            projectId: string;
            transferProofUrl: string | null;
            transferProofFileName: string | null;
            transferDate: Date | null;
            rejectedReason: string | null;
            chatId: string | null;
        })[];
        dividends: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        }[];
        owner: {
            id: string;
            email: string;
        };
        reports: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.ReportType;
            projectId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
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
            bankName: string;
            accountNumber: string;
            title: string;
            accountHolder: string;
        };
        investor: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
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
        description: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ProjectStatus;
        updatedAt: Date;
        bankName: string | null;
        accountNumber: string | null;
        title: string;
        ownerId: string;
        financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
        targetAmount: number | null;
        currentAmount: number;
        minInvestment: number | null;
        profitSharingPercentage: number | null;
        profitSharingPercentageAfterBEP: number | null;
        prospectusUrl: string | null;
        prospectusFileName: string | null;
        deadline: Date | null;
        accountHolder: string | null;
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
            description: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProjectStatus;
            updatedAt: Date;
            bankName: string | null;
            accountNumber: string | null;
            title: string;
            ownerId: string;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            accountHolder: string | null;
        };
        investor: {
            id: string;
            email: string;
            fullname: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
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
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
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
            owner: {
                id: string;
                email: string;
            };
            reports: {
                id: string;
                createdAt: Date;
                type: import(".prisma/client").$Enums.ReportType;
                projectId: string;
                fileUrl: string;
            }[];
            id: string;
            description: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProjectStatus;
            updatedAt: Date;
            bankName: string | null;
            accountNumber: string | null;
            title: string;
            ownerId: string;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            accountHolder: string | null;
        };
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
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
            description: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ProjectStatus;
            updatedAt: Date;
            bankName: string | null;
            accountNumber: string | null;
            title: string;
            ownerId: string;
            financialDocs: import("@prisma/client/runtime/library").JsonValue | null;
            targetAmount: number | null;
            currentAmount: number;
            minInvestment: number | null;
            profitSharingPercentage: number | null;
            profitSharingPercentageAfterBEP: number | null;
            prospectusUrl: string | null;
            prospectusFileName: string | null;
            deadline: Date | null;
            accountHolder: string | null;
        };
        investor: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedBy: string | null;
        approvedAt: Date | null;
        updatedAt: Date;
        amount: number;
        investorId: string;
        projectId: string;
        transferProofUrl: string | null;
        transferProofFileName: string | null;
        transferDate: Date | null;
        rejectedReason: string | null;
        chatId: string | null;
    }>;
    getProjectInvestments(req: any, projectId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvestmentStatus;
        approvedAt: Date;
        updatedAt: Date;
        amount: number;
        transferProofUrl: string;
        transferProofFileName: string;
        transferDate: Date;
        rejectedReason: string;
        investor: {
            id: string;
            email: string;
        };
    }[]>;
    previewProspectus(projectId: string, res: Response): Promise<StreamableFile>;
    downloadProspectus(projectId: string, res: Response): Promise<StreamableFile>;
}
