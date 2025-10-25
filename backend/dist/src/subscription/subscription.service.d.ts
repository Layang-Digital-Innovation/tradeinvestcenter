import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from './payment.service';
import { SubscriptionPlan, Role, PaymentProvider } from '@prisma/client';
export declare class SubscriptionService {
    private prisma;
    private paymentService;
    private readonly logger;
    constructor(prisma: PrismaService, paymentService: PaymentService);
    updateBillingPlan(id: string, data: {
        name?: string;
        description?: string;
        price?: number;
        currency?: string;
        period?: 'MONTHLY' | 'YEARLY';
        status?: string;
        plan?: SubscriptionPlan | string;
        provider?: PaymentProvider | string;
    }): Promise<{
        id: any;
        provider: any;
        providerPlanId: any;
        plan: any;
        name: any;
        description: any;
        price: any;
        currency: any;
        period: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }>;
    deleteBillingPlan(id: string): Promise<{
        success: boolean;
    }>;
    createLocalBillingPlan(params: {
        plan: any;
        price: number;
        period?: 'MONTHLY' | 'YEARLY';
        name?: string;
        currency?: string;
        provider?: string;
        status?: string;
    }): Promise<{
        id: any;
        provider: any;
        plan: any;
        name: any;
        price: any;
        currency: any;
        period: any;
        status: any;
    }>;
    getSubscriptionPlans(): Promise<any>;
    expirePastDueSubscriptions(): Promise<{
        totalCandidates: number;
        updated: number;
    }>;
    notifyEnterpriseCustomExpiringHMinus1(): Promise<{
        totalCandidates: number;
        userNotifications: number;
        adminNotifications: number;
    }>;
    approveManualOrgPayment(paymentId: string, approverUserId?: string): Promise<{
        success: boolean;
    }>;
    failManualOrgPayment(params: {
        paymentId: string;
        reason?: string;
        expireSubscriptions?: boolean;
    }): Promise<{
        success: boolean;
    }>;
    createOrgInvoiceForLabel(params: {
        adminUserId: string;
        labelId: string;
        userIds: string[];
        pricePerUser: number;
        totalAmount?: number;
        currency?: string;
        period: 'MONTHLY' | 'YEARLY';
        provider?: 'xendit' | 'manual';
        description?: string;
        invoiceNumber?: string;
        referenceNumber?: string;
        bankName?: string;
        paidBy?: string;
        notes?: string;
        awaitingApproval?: boolean;
        additionalSeats?: boolean;
    }): Promise<unknown>;
    activateBulkFromOrgInvoice(params: {
        labelId: string;
        userIds: string[];
        pricePerUser: number;
        currency?: string;
        period: 'MONTHLY' | 'YEARLY';
    }): Promise<{
        labelId: string;
        count: number;
    }>;
    createOrgInvoiceRenewalFromPayment(params: {
        adminUserId: string;
        previousPaymentId: string;
        period?: 'MONTHLY' | 'YEARLY';
        currency?: string;
        totalAmount?: number;
        pricePerUser?: number;
        provider?: 'xendit' | 'manual';
        description?: string;
        invoiceNumber?: string;
        referenceNumber?: string;
        bankName?: string;
        paidBy?: string;
        notes?: string;
        awaitingApproval?: boolean;
    }): Promise<unknown>;
    getUserSubscription(userId: string): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    createSubscription(userId: string, planId: string, paymentMethod: string): Promise<{
        subscription: {
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
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
            createdAt: Date;
            updatedAt: Date;
        };
        payment: unknown;
    }>;
    activateSubscription(subscriptionId: string): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancelSubscription(subscriptionId: string, userId: string): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    processPayment(paymentId: string): Promise<{
        status: string;
    }>;
    checkSubscriptionAccess(userId: string, requiredPlan: SubscriptionPlan): Promise<boolean>;
    getAllSubscriptions(): Promise<({
        user: {
            id: string;
            email: string;
            fullname: string;
            role: import(".prisma/client").$Enums.Role;
            labelInvestors: ({
                label: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                userId: string;
                labelId: string;
                createdAt: Date;
                updatedAt: Date;
            })[];
        };
        label: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            contactEmail: string | null;
            defaultPrice: number | null;
            currency: import(".prisma/client").$Enums.Currency | null;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        } | {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            contactEmail: string | null;
            defaultPrice: number | null;
            currency: import(".prisma/client").$Enums.Currency | null;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createEnterpriseLabel(data: {
        name: string;
        description?: string;
        ownerUserId?: string;
    }): Promise<any>;
    getEnterpriseLabels(): Promise<any>;
    updateEnterpriseLabel(id: string, data: {
        name?: string;
        description?: string;
    }): Promise<any>;
    deleteEnterpriseLabel(id: string): Promise<{
        success: boolean;
    }>;
    buildInvoiceHtml(paymentId: string): Promise<{
        payment: {
            label: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string;
                contactEmail: string | null;
                defaultPrice: number | null;
                currency: import(".prisma/client").$Enums.Currency | null;
                description: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            labelId: string | null;
            createdAt: Date;
            updatedAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            paymentLink: string | null;
            externalId: string | null;
            subscriptionId: string | null;
            providerData: import("@prisma/client/runtime/library").JsonValue | null;
            webhookData: import("@prisma/client/runtime/library").JsonValue | null;
            failureReason: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            expiredAt: Date | null;
            invoiceNumber: string | null;
        };
        html: string;
        filename: string;
    }>;
    streamInvoicePdf(res: any, paymentId: string): Promise<void>;
    bulkCreateInvestorsForLabel(params: {
        labelId: string;
        investors: Array<{
            email: string;
            fullName?: string;
            password?: string;
        }>;
        defaultPassword?: string;
        requireUniqueEmail?: boolean;
    }): Promise<{
        labelId: string;
        count: number;
        results: {
            userId: string;
            email: string;
            created: boolean;
            reason?: string;
        }[];
    }>;
    private ensureLabelInvestor;
    bulkSubscribeInvestorsForLabel(params: {
        labelId: string;
        userIds: string[];
        price: number;
        currency?: string;
        autoActivate?: boolean;
        period?: 'MONTHLY' | 'YEARLY';
    }): Promise<{
        labelId: string;
        count: number;
        results: {
            userId: string;
            subscriptionId: string;
            paymentId?: string;
        }[];
    }>;
    private calculatePeriodEnd;
    startTrialForEligibleUser(userId: string, role: Role): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    notifyTrialsExpiringHMinus1(): Promise<{
        totalCandidates: number;
        created: number;
    }>;
}
