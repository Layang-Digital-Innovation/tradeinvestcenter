import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardData(req: any): Promise<{
        totalInvested: number;
        projectCount: number;
        investments: ({
            project: {
                id: string;
                status: import(".prisma/client").$Enums.ProjectStatus;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
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
                bankName: string | null;
                accountNumber: string | null;
                accountHolder: string | null;
            };
        } & {
            id: string;
            amount: number;
            status: import(".prisma/client").$Enums.InvestmentStatus;
            investorId: string;
            projectId: string;
            transferProofUrl: string | null;
            transferProofFileName: string | null;
            transferDate: Date | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            rejectedReason: string | null;
            chatId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } | {
        projectCount: number;
        totalRaised: number;
        totalDividends: number;
        projects: ({
            investments: {
                id: string;
                amount: number;
                status: import(".prisma/client").$Enums.InvestmentStatus;
                investorId: string;
                projectId: string;
                transferProofUrl: string | null;
                transferProofFileName: string | null;
                transferDate: Date | null;
                approvedBy: string | null;
                approvedAt: Date | null;
                rejectedReason: string | null;
                chatId: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            dividends: {
                id: string;
                amount: number;
                projectId: string;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
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
            bankName: string | null;
            accountNumber: string | null;
            accountHolder: string | null;
        })[];
    } | {
        userCount: number;
        investorCount: number;
        projectOwnerCount: number;
        buyerCount: number;
        sellerCount: number;
        projectCount: number;
        orderCount: number;
        activeSubscriptions: number;
    }>;
    getSummary(req: any): Promise<{
        totalInvested: number;
        projectCount: number;
        investmentCount: number;
    } | {
        projectCount: number;
        totalRaised: number;
        totalDividends: number;
    } | {
        userCount: number;
        projectCount: number;
        totalInvestments: number;
        activeSubscriptions: number;
    }>;
    getStats(req: any): Promise<{
        investmentTrend: {
            month: string;
            value: unknown;
        }[];
        dividendTrend: {
            month: string;
            value: unknown;
        }[];
    } | {
        userGrowth: {
            month: string;
            value: unknown;
        }[];
        investmentTrend: {
            month: string;
            value: unknown;
        }[];
        subscriptionTrend: {
            month: string;
            value: unknown;
        }[];
    }>;
    getUserAnalytics(): Promise<{
        totalUsers: number;
        usersByRole: {
            role: import(".prisma/client").$Enums.Role;
            count: number;
        }[];
        recentUsers: {
            id: string;
            createdAt: Date;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        }[];
        userGrowth: {
            month: string;
            value: unknown;
        }[];
    }>;
    getSubscriptionAnalytics(currency?: string): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        subscriptionsByPlan: {
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            count: number;
        }[];
        recentSubscriptions: ({
            user: {
                email: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            startedAt: Date;
            expiresAt: Date | null;
            trialEndsAt: Date | null;
            cancelledAt: Date | null;
            pausedAt: Date | null;
            renewalDate: Date | null;
            autoRenew: boolean;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
            labelId: string | null;
            customPrice: number | null;
            customCurrency: import(".prisma/client").$Enums.Currency;
        })[];
        totalRevenue: number;
        revenueByProvider: {
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            count: number;
        }[];
        revenueByCurrency: {
            currency: import(".prisma/client").$Enums.Currency;
            amount: number;
            count: number;
        }[];
        currency: "IDR" | "USD";
    }>;
    getRevenueAnalytics(): Promise<{
        totalRevenue: number;
        monthlyRevenue: {
            month: string;
            value: unknown;
        }[];
        revenueByType: {
            type: import(".prisma/client").$Enums.PaymentType;
            amount: number;
            count: number;
        }[];
        recentPayments: ({
            user: {
                email: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            amount: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            labelId: string | null;
            currency: import(".prisma/client").$Enums.Currency;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            paymentLink: string | null;
            externalId: string | null;
            subscriptionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            providerData: import("@prisma/client/runtime/library").JsonValue | null;
            webhookData: import("@prisma/client/runtime/library").JsonValue | null;
            failureReason: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            expiredAt: Date | null;
            invoiceNumber: string | null;
        })[];
    }>;
}
