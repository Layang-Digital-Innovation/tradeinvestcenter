import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SubscriptionPlan } from '@prisma/client';
export declare class XenditSubscriptionService {
    private prisma;
    private configService;
    private readonly logger;
    private readonly xenditClient;
    constructor(prisma: PrismaService, configService: ConfigService);
    createSubscriptionPlan(data: {
        userId: string;
        plan: SubscriptionPlan;
        price: number;
        currency?: string;
    }): Promise<{
        subscriptionId: string;
        paymentId: string;
        planId: string;
        paymentLink: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        paymentRequest: any;
    }>;
    createOneTimePayment(data: {
        userId: string;
        amount: number;
        description: string;
        currency?: string;
    }): Promise<{
        paymentId: string;
        invoiceId: string;
        paymentLink: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        invoice: any;
    }>;
    handleSubscriptionWebhook(eventType: string, data: any): Promise<void | {
        success: boolean;
        message: string;
    }>;
    private handlePlanActivated;
    private handleCycleCreated;
    private handleCycleSucceeded;
    private handleCycleFailed;
    private handlePlanDeactivated;
    private handlePlanStopped;
    cancelSubscription(subscriptionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSubscriptionDetails(subscriptionId: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            labelId: string | null;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            currency: import(".prisma/client").$Enums.Currency;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            paymentLink: string | null;
            externalId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            providerData: import("@prisma/client/runtime/library").JsonValue | null;
            webhookData: import("@prisma/client/runtime/library").JsonValue | null;
            failureReason: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            expiredAt: Date | null;
            description: string | null;
            invoiceNumber: string | null;
            subscriptionId: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        customPrice: number | null;
        customCurrency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        labelId: string | null;
    }>;
    checkAndUpdateSubscriptionStatus(subscriptionId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        customPrice: number | null;
        customCurrency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        labelId: string | null;
    }>;
    getExpiringSubscriptions(daysBeforeExpiry?: number): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        customPrice: number | null;
        customCurrency: import(".prisma/client").$Enums.Currency;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        labelId: string | null;
    })[]>;
    resumeSubscription(subscriptionId: string): Promise<{
        success: boolean;
        message: string;
        newPaymentLink: string;
        newPlanId: string;
    }>;
    private calculateTrialEnd;
    private calculatePeriodEnd;
    private logSubscriptionHistory;
}
