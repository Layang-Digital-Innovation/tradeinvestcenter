import { PrismaService } from '../prisma/prisma.service';
export declare class InvestmentHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getInvestorHistory(investorId: string): Promise<{
        totalDividendsReceived: number;
        pendingDividends: number;
        project: {
            id: string;
            description: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            title: string;
            owner: {
                id: string;
                email: string;
            };
        };
        dividendDistributions: ({
            dividend: {
                id: string;
                amount: number;
                date: Date;
            };
        } & {
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
        })[];
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
    getInvestorProfitSharing(investorId: string, projectId?: string): Promise<({
        investment: {
            id: string;
            createdAt: Date;
            amount: number;
        };
        dividend: {
            project: {
                id: string;
                description: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            projectId: string;
            date: Date;
        };
    } & {
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
    })[]>;
    getInvestorSummary(investorId: string): Promise<{
        totalInvested: number;
        totalDividendsReceived: number;
        pendingDividends: number;
        activeInvestments: number;
        totalProjects: number;
        roi: number;
    }>;
    getProjectInvestmentAnalytics(projectId: string, ownerId: string): Promise<{
        project: {
            id: string;
            title: string;
            targetAmount: number;
            currentAmount: number;
            status: import(".prisma/client").$Enums.ProjectStatus;
        };
        analytics: {
            totalInvestments: number;
            totalInvestors: number;
            totalDividendsDistributed: number;
            fundingProgress: number;
        };
        investorBreakdown: {
            investor: {
                id: string;
                email: string;
            };
            investmentAmount: number;
            investmentDate: Date;
            dividendsReceived: number;
            pendingDividends: number;
        }[];
        dividendHistory: {
            id: string;
            distributions: {
                id: string;
                status: import(".prisma/client").$Enums.DividendStatus;
                amount: number;
                investor: {
                    id: string;
                    email: string;
                };
            }[];
        }[];
    }>;
    getAllInvestmentActivities(page?: number, limit?: number): Promise<{
        investments: ({
            project: {
                id: string;
                description: string;
                title: string;
                owner: {
                    id: string;
                    email: string;
                };
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
