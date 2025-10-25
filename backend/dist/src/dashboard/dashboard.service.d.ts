import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getInvestorDashboard(userId: string): Promise<{
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
    }>;
    getProjectOwnerDashboard(userId: string): Promise<{
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
    }>;
    getBuyerDashboard(userId: string): Promise<{
        orderCount: number;
        totalSpent: any;
        orders: ({
            product: {
                id: string;
                status: import(".prisma/client").$Enums.ProductStatus;
                approvedBy: string | null;
                approvedAt: Date | null;
                createdAt: Date;
                name: string;
                description: string;
                currency: string | null;
                price: number | null;
                unit: string;
                weight: number;
                volume: string;
                sellerId: string;
                priceType: import(".prisma/client").$Enums.PriceType;
            };
            shipment: {
                id: string;
                status: import(".prisma/client").$Enums.ShipmentStatus;
                createdAt: Date;
                updatedAt: Date;
                currency: import(".prisma/client").$Enums.Currency | null;
                method: import(".prisma/client").$Enums.ShipmentMethod;
                orderId: string;
                carrier: string | null;
                trackingNumber: string | null;
                trackingUrl: string | null;
                seaPricingMode: import(".prisma/client").$Enums.SeaPricingMode | null;
                cbmVolume: number | null;
                containerType: import(".prisma/client").$Enums.ContainerType | null;
                freightCost: number | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            productId: string;
            buyerId: string;
            quantity: number;
            notes: string | null;
            currency: import(".prisma/client").$Enums.Currency;
            pricePerUnit: number;
            totalPrice: number;
        })[];
    }>;
    getSellerDashboard(userId: string): Promise<{
        productCount: number;
        orderCount: number;
        totalSales: any;
        products: ({
            orders: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                createdAt: Date;
                productId: string;
                buyerId: string;
                quantity: number;
                notes: string | null;
                currency: import(".prisma/client").$Enums.Currency;
                pricePerUnit: number;
                totalPrice: number;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            approvedBy: string | null;
            approvedAt: Date | null;
            createdAt: Date;
            name: string;
            description: string;
            currency: string | null;
            price: number | null;
            unit: string;
            weight: number;
            volume: string;
            sellerId: string;
            priceType: import(".prisma/client").$Enums.PriceType;
        })[];
    }>;
    getAdminDashboard(): Promise<{
        userCount: number;
        investorCount: number;
        projectOwnerCount: number;
        buyerCount: number;
        sellerCount: number;
        projectCount: number;
        orderCount: number;
        activeSubscriptions: number;
    }>;
    getInvestorSummary(userId: string): Promise<{
        totalInvested: number;
        projectCount: number;
        investmentCount: number;
    }>;
    getProjectOwnerSummary(userId: string): Promise<{
        projectCount: number;
        totalRaised: number;
        totalDividends: number;
    }>;
    getAdminSummary(): Promise<{
        userCount: number;
        projectCount: number;
        totalInvestments: number;
        activeSubscriptions: number;
    }>;
    getInvestorStats(userId: string): Promise<{
        investmentTrend: {
            month: string;
            value: unknown;
        }[];
        dividendTrend: {
            month: string;
            value: unknown;
        }[];
    }>;
    getProjectOwnerStats(userId: string): Promise<{
        investmentTrend: {
            month: string;
            value: unknown;
        }[];
        dividendTrend: {
            month: string;
            value: unknown;
        }[];
    }>;
    getAdminStats(): Promise<{
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
    getSubscriptionAnalytics(currency?: 'IDR' | 'USD'): Promise<{
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
            currency: import(".prisma/client").$Enums.Currency;
            userId: string;
            labelId: string | null;
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
    private groupByMonth;
}
