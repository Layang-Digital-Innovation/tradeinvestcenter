import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SubscriptionService } from './subscription.service';
import { PaymentService } from './payment.service';
import { PaypalSubscriptionService } from './paypal-subscription.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { SubscriptionPlan } from '@prisma/client';
export declare class SubscriptionController {
    private readonly subscriptionService;
    private readonly paymentService;
    private readonly paypalSubscriptionService;
    private readonly paymentGateway;
    private readonly configService;
    constructor(subscriptionService: SubscriptionService, paymentService: PaymentService, paypalSubscriptionService: PaypalSubscriptionService, paymentGateway: PaymentGatewayService, configService: ConfigService);
    getSubscriptionPlans(): Promise<any>;
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
    getUserSubscription(req: any): Promise<{
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
    createSubscription(req: any, data: {
        planId: string;
        paymentMethod: string;
    }): Promise<{
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
    activateSubscription(id: string): Promise<{
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
    executePaypalPayment(paymentId: string, payerId: string): Promise<unknown>;
    cancelPayment(): Promise<{
        success: boolean;
        message: string;
    }>;
    createBillingPlan(data: {
        plan: SubscriptionPlan;
        price: number;
        period?: 'MONTHLY' | 'YEARLY';
        name?: string;
        currency?: 'USD' | 'IDR' | string;
        provider?: 'PAYPAL' | 'XENDIT' | string;
    }): Promise<unknown>;
    updateBillingPlan(id: string, body: {
        name?: string;
        description?: string;
        price?: number;
        currency?: string;
        period?: 'MONTHLY' | 'YEARLY';
        status?: string;
        plan?: SubscriptionPlan | string;
        provider?: any;
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
    createBillingAgreement(req: any, data: {
        planId: string;
        billingPlanId: string;
    }): Promise<unknown>;
    executeBillingAgreement(token: string, baToken: string, res: Response): Promise<void>;
    cancelSubscription(id: string, req: any): Promise<{
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
    verifyPayment(data: {
        paymentId: string;
        transactionId: string;
    }): Promise<{
        success: boolean;
    }>;
    getPayment(id: string): Promise<{
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
        user: {
            id: string;
            email: string;
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
    }>;
    getUserPayments(req: any): Promise<({
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
    })[]>;
    unifiedCheckout(req: any, body: {
        type: 'subscription' | 'one_time';
        plan?: any;
        price?: number;
        currency?: 'IDR' | 'USD';
        provider?: 'xendit' | 'paypal';
        billingPlanId?: string;
        description?: string;
    }): Promise<unknown>;
    startTrial(req: any): Promise<{
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
    notifyExpiringTrials(): Promise<{
        totalCandidates: number;
        created: number;
    }>;
    notifyEnterpriseExpiring(): Promise<{
        totalCandidates: number;
        userNotifications: number;
        adminNotifications: number;
    }>;
    checkAccess(req: any, tier: SubscriptionPlan): Promise<{
        hasAccess: boolean;
    }>;
    getEnterpriseLabels(): Promise<any>;
    createEnterpriseLabel(body: {
        name: string;
        description?: string;
        ownerUserId?: string;
    }): Promise<any>;
    updateEnterpriseLabel(id: string, body: {
        name?: string;
        description?: string;
    }): Promise<any>;
    deleteEnterpriseLabel(id: string): Promise<{
        success: boolean;
    }>;
    bulkCreateInvestors(body: {
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
    bulkSubscribeInvestors(body: {
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
    createOrgInvoice(req: any, body: {
        labelId: string;
        userIds: string[];
        pricePerUser?: number;
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
    renewOrgInvoice(req: any, body: {
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
    xenditWebhook(payload: any): Promise<{
        success: boolean;
    }>;
    approveManualOrg(body: {
        paymentId: string;
    }): Promise<{
        success: boolean;
    }>;
    failManualOrg(body: {
        paymentId: string;
        reason?: string;
        expireSubscriptions?: boolean;
    }): Promise<{
        success: boolean;
    }>;
    listAdminPayments(labelId?: string, status?: string, provider?: string, mode?: string, limit?: string): Promise<{
        items: {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            labelId: string;
            createdAt: Date;
            label: {
                id: string;
                name: string;
            };
            currency: import(".prisma/client").$Enums.Currency;
            description: string;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            paidAt: Date;
            invoiceNumber: string;
        }[];
    }>;
    getInvoiceHtml(id: string, res: Response): Promise<void>;
    getInvoicePdf(id: string, res: Response): Promise<void>;
}
