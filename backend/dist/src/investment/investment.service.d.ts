import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { ProjectStatus, ReportType, InvestmentStatus, Role } from '@prisma/client';
export declare class InvestmentService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    createProject(ownerId: string, data: {
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
    getProjects(filters?: {
        status?: ProjectStatus;
    }): Promise<{
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
    investInProject(investorId: string, projectId: string, amount: number): Promise<{
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
    updateProjectStatus(projectId: string, status: ProjectStatus): Promise<{
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
    addProjectReport(projectId: string, data: {
        type: any;
        fileUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        projectId: string;
        fileUrl: string;
    }>;
    distributeDividend(projectId: string, data: {
        amount: number;
        date: Date;
        afterBEP?: boolean;
    }): Promise<any>;
    getProjectsByOwner(ownerId: string): Promise<{
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
    updateProject(projectId: string, ownerId: string, data: {
        title?: string;
        description?: string;
        targetAmount?: number;
        deadline?: Date | string;
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
    updateBankAccount(projectId: string, ownerId: string, data: {
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
    addFinancialReport(projectId: string, ownerId: string, data: {
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
    getInvestorPortfolio(investorId: string): Promise<{
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
    getInvestmentHistory(investorId: string): Promise<({
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
    getDividendHistory(investorId: string): Promise<any[]>;
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
    createInvestmentRequest(investorId: string, projectId: string, chatId: string): Promise<{
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
    getProjectDetailsForInvestor(investorId: string, projectId: string): Promise<{
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
    approveInvestment(adminId: string, investmentId: string, data?: {
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
    rejectInvestment(adminId: string, investmentId: string, data: {
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
    getAllInvestmentsForAdmin(page?: number, limit?: number, status?: InvestmentStatus): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPendingInvestments(): Promise<any[]>;
    getPendingProjectsCount(): Promise<{
        count: number;
    }>;
    getInvestorApprovedProjects(investorId: string): Promise<{
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
    getInvestmentById(investmentId: string, userId: string, userRole: Role): Promise<{
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
    getProjectInvestments(projectId: string, ownerId: string): Promise<{
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
    getProspectusInfo(projectId: string): Promise<{
        prospectusUrl: string;
        prospectusFileName: string;
    }>;
}
