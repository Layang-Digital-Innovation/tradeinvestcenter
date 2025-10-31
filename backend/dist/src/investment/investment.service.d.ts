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
    getProjects(filters?: {
        status?: ProjectStatus;
    }): Promise<{
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
    updateProjectStatus(projectId: string, status: ProjectStatus): Promise<{
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
    addProjectReport(projectId: string, data: {
        type: any;
        fileUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        type: import(".prisma/client").$Enums.ReportType;
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
    updateBankAccount(projectId: string, ownerId: string, data: {
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
    addFinancialReport(projectId: string, ownerId: string, data: {
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
    getInvestmentHistory(investorId: string): Promise<({
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
    getDividendHistory(investorId: string): Promise<any[]>;
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
    createInvestmentRequest(investorId: string, projectId: string, chatId: string): Promise<{
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
    getInvestmentById(investmentId: string, userId: string, userRole: Role): Promise<{
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
    getProjectInvestments(projectId: string, ownerId: string): Promise<{
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
    getProspectusInfo(projectId: string): Promise<{
        prospectusUrl: string;
        prospectusFileName: string;
    }>;
}
