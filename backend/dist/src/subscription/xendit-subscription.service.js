"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var XenditSubscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XenditSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const xendit_node_1 = require("xendit-node");
const PaymentRequestCurrency_1 = require("xendit-node/payment_request/models/PaymentRequestCurrency");
let XenditSubscriptionService = XenditSubscriptionService_1 = class XenditSubscriptionService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(XenditSubscriptionService_1.name);
        this.xenditClient = new xendit_node_1.Xendit({
            secretKey: this.configService.get('XENDIT_SECRET_KEY'),
        });
    }
    async createSubscriptionPlan(data) {
        var _a, _b;
        try {
            const paymentRequest = await this.xenditClient.PaymentRequest.createPaymentRequest({
                data: {
                    referenceId: `plan_${data.userId}_${Date.now()}`,
                    amount: data.price,
                    currency: data.currency || PaymentRequestCurrency_1.PaymentRequestCurrency.Idr,
                }
            });
            const subscription = await this.prisma.subscription.create({
                data: {
                    userId: data.userId,
                    plan: data.plan,
                    status: client_1.SubscriptionStatus.TRIAL,
                    startedAt: new Date(),
                    expiresAt: null,
                    trialEndsAt: this.calculateTrialEnd(new Date()),
                    autoRenew: true,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: null
                }
            });
            const payment = await this.prisma.payment.create({
                data: {
                    userId: data.userId,
                    provider: client_1.PaymentProvider.XENDIT,
                    amount: data.price,
                    currency: ((data.currency === 'USD') ? client_1.Currency.USD : client_1.Currency.IDR),
                    paymentType: client_1.PaymentType.RECURRING,
                    status: client_1.PaymentStatus.PENDING,
                    description: `${data.plan} subscription payment`,
                    subscriptionId: subscription.id,
                    externalId: paymentRequest.id,
                    paymentLink: (_b = (_a = paymentRequest.actions) === null || _a === void 0 ? void 0 : _a.find(a => a.action === 'AUTH')) === null || _b === void 0 ? void 0 : _b.url,
                    metadata: {
                        paymentRequestId: paymentRequest.id,
                        planType: data.plan,
                        planData: JSON.parse(JSON.stringify(paymentRequest)),
                        currency: data.currency || 'IDR',
                        createdAt: new Date().toISOString(),
                    },
                    providerData: {
                        xenditPaymentRequest: paymentRequest
                    }
                }
            });
            return {
                subscriptionId: subscription.id,
                paymentId: payment.id,
                planId: paymentRequest.id,
                paymentLink: payment.paymentLink,
                status: subscription.status,
                paymentRequest: JSON.parse(JSON.stringify(paymentRequest)),
            };
        }
        catch (error) {
        }
    }
    async createOneTimePayment(data) {
        try {
            const invoice = await this.xenditClient.Invoice.createInvoice({
                data: {
                    externalId: `onetime_${data.userId}_${Date.now()}`,
                    amount: data.amount,
                    description: data.description,
                    invoiceDuration: 86400,
                    currency: data.currency || PaymentRequestCurrency_1.PaymentRequestCurrency.Idr,
                    reminderTime: 1,
                    successRedirectUrl: `${this.configService.get('APP_URL')}/payment/success`,
                    failureRedirectUrl: `${this.configService.get('APP_URL')}/payment/failed`,
                }
            });
            const payment = await this.prisma.payment.create({
                data: {
                    userId: data.userId,
                    provider: client_1.PaymentProvider.XENDIT,
                    amount: data.amount,
                    currency: ((data.currency === 'USD') ? client_1.Currency.USD : client_1.Currency.IDR),
                    paymentType: client_1.PaymentType.ONE_TIME,
                    status: client_1.PaymentStatus.PENDING,
                    description: data.description,
                    externalId: invoice.id,
                    paymentLink: invoice.invoiceUrl,
                    metadata: {
                        invoiceId: invoice.id,
                        invoiceUrl: invoice.invoiceUrl,
                        description: data.description,
                        currency: data.currency || 'IDR',
                        invoiceData: JSON.parse(JSON.stringify(invoice)),
                    },
                    providerData: {
                        xenditInvoice: invoice
                    }
                }
            });
            return {
                paymentId: payment.id,
                invoiceId: invoice.id,
                paymentLink: invoice.invoiceUrl,
                status: payment.status,
                invoice: JSON.parse(JSON.stringify(invoice)),
            };
        }
        catch (error) {
            this.logger.error(`Error creating Xendit one-time payment: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handleSubscriptionWebhook(eventType, data) {
        try {
            this.logger.log(`Received Xendit webhook: ${eventType}`, data);
            switch (eventType) {
                case 'recurring.plan.activated':
                    return await this.handlePlanActivated(data);
                case 'recurring.cycle.created':
                    return await this.handleCycleCreated(data);
                case 'recurring.cycle.succeeded':
                    return await this.handleCycleSucceeded(data);
                case 'recurring.cycle.failed':
                    return await this.handleCycleFailed(data);
                case 'recurring.plan.deactivated':
                    return await this.handlePlanDeactivated(data);
                case 'recurring.plan.stopped':
                    return await this.handlePlanStopped(data);
                default:
                    this.logger.warn(`Unhandled webhook event: ${eventType}`);
                    return { success: false, message: `Unhandled event: ${eventType}` };
            }
        }
        catch (error) {
            this.logger.error(`Error handling Xendit webhook: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handlePlanActivated(data) {
        try {
            this.logger.log('Processing plan activated webhook:', data);
            const payment = await this.prisma.payment.findFirst({
                where: { externalId: data.id },
                include: { subscription: true }
            });
            if (!payment || !payment.subscription) {
                this.logger.warn(`Payment or subscription not found for plan: ${data.id}`);
                return;
            }
            await this.prisma.subscription.update({
                where: { id: payment.subscriptionId },
                data: {
                    status: client_1.SubscriptionStatus.ACTIVE,
                    startedAt: new Date(),
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: this.calculatePeriodEnd(new Date(), payment.subscription.plan),
                    autoRenew: true
                }
            });
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.PAID,
                    paidAt: new Date(),
                    metadata: Object.assign(Object.assign({}, payment.metadata), { planActivatedAt: new Date().toISOString(), xenditPlanData: data }),
                    providerData: Object.assign(Object.assign({}, payment.providerData), { planActivatedData: data })
                }
            });
            await this.logSubscriptionHistory(payment.subscriptionId, 'ACTIVATED', client_1.SubscriptionStatus.TRIAL, client_1.SubscriptionStatus.ACTIVE, 'Plan activated via Xendit webhook');
            this.logger.log(`Subscription activated: ${payment.subscriptionId}`);
        }
        catch (error) {
            this.logger.error('Error handling plan activated:', error);
        }
    }
    async handleCycleCreated(data) {
        try {
            this.logger.log(`Subscription cycle created: ${data.id} for plan: ${data.recurringPlanId}`);
            const payment = await this.prisma.payment.findFirst({
                where: { externalId: data.recurringPlanId }
            });
            if (payment) {
                await this.prisma.payment.create({
                    data: {
                        userId: payment.userId,
                        provider: client_1.PaymentProvider.XENDIT,
                        amount: data.amount || 0,
                        status: client_1.PaymentStatus.PENDING,
                        subscriptionId: payment.subscriptionId,
                        externalId: data.id,
                        metadata: {
                            cycleType: 'CREATED',
                            cycleData: JSON.parse(JSON.stringify(data)),
                            recurringPlanId: data.recurringPlanId,
                            scheduledAt: data.scheduledTimestamp,
                            createdAt: new Date().toISOString(),
                        }
                    }
                });
            }
            return { success: true, message: 'Cycle created logged' };
        }
        catch (error) {
            this.logger.error(`Error handling cycle created: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handleCycleSucceeded(data) {
        try {
            const originalPayment = await this.prisma.payment.findFirst({
                where: { externalId: data.recurringPlanId },
                include: { subscription: true }
            });
            if (!originalPayment || !originalPayment.subscriptionId) {
                this.logger.warn(`Original payment not found for cycle: ${data.id}`);
                return { success: false, message: 'Original payment not found' };
            }
            await this.prisma.payment.create({
                data: {
                    userId: originalPayment.userId,
                    provider: client_1.PaymentProvider.XENDIT,
                    amount: data.amount,
                    status: client_1.PaymentStatus.PAID,
                    subscriptionId: originalPayment.subscriptionId,
                    externalId: data.id,
                    metadata: {
                        cycleType: 'SUCCESS',
                        cycleData: JSON.parse(JSON.stringify(data)),
                        recurringPlanId: data.recurringPlanId,
                        paidAt: data.paidTimestamp || new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                    }
                }
            });
            const subscription = originalPayment.subscription;
            if (subscription) {
                let newExpiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : new Date();
                if (subscription.plan === client_1.SubscriptionPlan.GOLD_MONTHLY) {
                    newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);
                }
                else if (subscription.plan === client_1.SubscriptionPlan.GOLD_YEARLY) {
                    newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1);
                }
                await this.prisma.subscription.update({
                    where: { id: originalPayment.subscriptionId },
                    data: {
                        expiresAt: newExpiresAt,
                        status: client_1.SubscriptionStatus.ACTIVE
                    }
                });
            }
            this.logger.log(`Subscription cycle succeeded: ${data.id}`);
            return { success: true, message: 'Cycle payment processed' };
        }
        catch (error) {
            this.logger.error(`Error handling cycle succeeded: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handleCycleFailed(data) {
        try {
            const originalPayment = await this.prisma.payment.findFirst({
                where: { externalId: data.recurringPlanId }
            });
            if (!originalPayment || !originalPayment.subscriptionId) {
                this.logger.warn(`Original payment not found for failed cycle: ${data.id}`);
                return { success: false, message: 'Original payment not found' };
            }
            await this.prisma.payment.create({
                data: {
                    userId: originalPayment.userId,
                    provider: client_1.PaymentProvider.XENDIT,
                    amount: data.amount || 0,
                    status: client_1.PaymentStatus.FAILED,
                    subscriptionId: originalPayment.subscriptionId,
                    externalId: data.id,
                    metadata: {
                        cycleType: 'FAILED',
                        cycleData: JSON.parse(JSON.stringify(data)),
                        recurringPlanId: data.recurringPlanId,
                        failureReason: data.failureCode || data.failureReason || 'Unknown failure',
                        failedAt: new Date().toISOString(),
                    }
                }
            });
            const failedPaymentsCount = await this.prisma.payment.count({
                where: {
                    subscriptionId: originalPayment.subscriptionId,
                    status: client_1.PaymentStatus.FAILED,
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            });
            if (failedPaymentsCount >= 3) {
                await this.prisma.subscription.update({
                    where: { id: originalPayment.subscriptionId },
                    data: {
                        status: client_1.SubscriptionStatus.EXPIRED,
                    }
                });
                this.logger.warn(`Subscription suspended due to multiple payment failures: ${originalPayment.subscriptionId}`);
            }
            this.logger.warn(`Subscription cycle failed: ${data.id} - Reason: ${data.failureCode}`);
            return { success: true, message: 'Failed cycle recorded' };
        }
        catch (error) {
            this.logger.error(`Error handling cycle failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handlePlanDeactivated(data) {
        try {
            const payment = await this.prisma.payment.findFirst({
                where: { externalId: data.id }
            });
            if (!payment || !payment.subscriptionId) {
                this.logger.warn(`Payment not found for deactivated plan: ${data.id}`);
                return { success: false, message: 'Payment not found' };
            }
            await this.prisma.subscription.update({
                where: { id: payment.subscriptionId },
                data: {
                    status: client_1.SubscriptionStatus.EXPIRED,
                }
            });
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    metadata: Object.assign(Object.assign({}, payment.metadata), { deactivatedAt: new Date().toISOString(), deactivationData: JSON.parse(JSON.stringify(data)) })
                }
            });
            this.logger.log(`Subscription deactivated: ${payment.subscriptionId}`);
            return { success: true, message: 'Subscription deactivated' };
        }
        catch (error) {
            this.logger.error(`Error handling plan deactivated: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handlePlanStopped(data) {
        try {
            const payment = await this.prisma.payment.findFirst({
                where: { externalId: data.id }
            });
            if (!payment || !payment.subscriptionId) {
                this.logger.warn(`Payment not found for stopped plan: ${data.id}`);
                return { success: false, message: 'Payment not found' };
            }
            await this.prisma.subscription.update({
                where: { id: payment.subscriptionId },
                data: {
                    status: client_1.SubscriptionStatus.EXPIRED,
                }
            });
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    metadata: Object.assign(Object.assign({}, payment.metadata), { stoppedAt: new Date().toISOString(), stopData: JSON.parse(JSON.stringify(data)) })
                }
            });
            this.logger.log(`Subscription stopped: ${payment.subscriptionId}`);
            return { success: true, message: 'Subscription stopped' };
        }
        catch (error) {
            this.logger.error(`Error handling plan stopped: ${error.message}`, error.stack);
            throw error;
        }
    }
    async cancelSubscription(subscriptionId) {
        try {
            const subscription = await this.prisma.subscription.findUnique({
                where: { id: subscriptionId }
            });
            if (!subscription) {
                throw new Error(`Subscription tidak ditemukan: ${subscriptionId}`);
            }
            const payment = await this.prisma.payment.findFirst({
                where: {
                    subscriptionId: subscriptionId,
                    provider: client_1.PaymentProvider.XENDIT,
                    status: { in: [client_1.PaymentStatus.PAID, client_1.PaymentStatus.PENDING] }
                },
                orderBy: { createdAt: 'desc' }
            });
            if (payment && payment.externalId) {
                try {
                    this.logger.log(`Attempting to cancel Xendit payment request: ${payment.externalId}`);
                }
                catch (xenditError) {
                    this.logger.warn(`Failed to cancel Xendit payment request ${payment.externalId}: ${xenditError.message}`);
                }
            }
            await this.prisma.subscription.update({
                where: { id: subscriptionId },
                data: {
                    status: client_1.SubscriptionStatus.CANCELLED,
                    cancelledAt: new Date(),
                    autoRenew: false
                }
            });
            if (payment) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        metadata: Object.assign(Object.assign({}, payment.metadata), { cancelledAt: new Date().toISOString(), cancelledBy: 'user' })
                    }
                });
            }
            return { success: true, message: 'Subscription berhasil dibatalkan' };
        }
        catch (error) {
            this.logger.error(`Error canceling subscription: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getSubscriptionDetails(subscriptionId) {
        try {
            return await this.prisma.subscription.findUnique({
                where: { id: subscriptionId },
                include: {
                    payments: {
                        orderBy: { createdAt: 'desc' }
                    },
                    user: {
                        select: { id: true, email: true }
                    }
                }
            });
        }
        catch (error) {
            this.logger.error(`Error getting subscription details: ${error.message}`, error.stack);
            throw error;
        }
    }
    async checkAndUpdateSubscriptionStatus(subscriptionId) {
        try {
            const subscription = await this.prisma.subscription.findUnique({
                where: { id: subscriptionId }
            });
            if (!subscription) {
                throw new Error(`Subscription not found: ${subscriptionId}`);
            }
            if (subscription.expiresAt && subscription.expiresAt < new Date()) {
                await this.prisma.subscription.update({
                    where: { id: subscriptionId },
                    data: { status: client_1.SubscriptionStatus.EXPIRED }
                });
                return Object.assign(Object.assign({}, subscription), { status: client_1.SubscriptionStatus.EXPIRED });
            }
            return subscription;
        }
        catch (error) {
            this.logger.error(`Error checking subscription status: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getExpiringSubscriptions(daysBeforeExpiry = 3) {
        try {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + daysBeforeExpiry);
            return await this.prisma.subscription.findMany({
                where: {
                    status: client_1.SubscriptionStatus.ACTIVE,
                    expiresAt: {
                        lte: expiryDate,
                        gte: new Date()
                    }
                },
                include: {
                    user: {
                        select: { id: true, email: true }
                    }
                }
            });
        }
        catch (error) {
            this.logger.error(`Error getting expiring subscriptions: ${error.message}`, error.stack);
            throw error;
        }
    }
    async resumeSubscription(subscriptionId) {
        try {
            const subscription = await this.prisma.subscription.findUnique({
                where: { id: subscriptionId },
                include: { payments: true }
            });
            if (!subscription) {
                throw new Error(`Subscription not found: ${subscriptionId}`);
            }
            if (subscription.status !== client_1.SubscriptionStatus.EXPIRED) {
                throw new Error(`Subscription is not expired, cannot resume: ${subscriptionId}`);
            }
            const originalPayment = subscription.payments.find(p => p.provider === client_1.PaymentProvider.XENDIT &&
                p.externalId &&
                p.metadata &&
                p.metadata.planType);
            if (!originalPayment) {
                throw new Error(`Original payment record not found for subscription: ${subscriptionId}`);
            }
            const newPlan = await this.createSubscriptionPlan({
                userId: subscription.userId,
                plan: subscription.plan,
                price: originalPayment.amount,
                currency: originalPayment.metadata.currency || PaymentRequestCurrency_1.PaymentRequestCurrency.Idr
            });
            await this.prisma.subscription.update({
                where: { id: subscriptionId },
                data: {
                    status: client_1.SubscriptionStatus.TRIAL,
                }
            });
            return {
                success: true,
                message: 'Subscription resumed with new payment plan',
                newPaymentLink: newPlan.paymentLink,
                newPlanId: newPlan.planId
            };
        }
        catch (error) {
            this.logger.error(`Error resuming subscription: ${error.message}`, error.stack);
            throw error;
        }
    }
    calculateTrialEnd(startDate) {
        const trialEnd = new Date(startDate);
        trialEnd.setDate(trialEnd.getDate() + 7);
        return trialEnd;
    }
    calculatePeriodEnd(startDate, plan) {
        const periodEnd = new Date(startDate);
        if (plan === client_1.SubscriptionPlan.GOLD_MONTHLY) {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        }
        else if (plan === client_1.SubscriptionPlan.GOLD_YEARLY) {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        }
        else {
            periodEnd.setDate(periodEnd.getDate() + 30);
        }
        return periodEnd;
    }
    async logSubscriptionHistory(subscriptionId, action, oldStatus, newStatus, reason) {
        try {
            await this.prisma.subscriptionHistory.create({
                data: {
                    subscriptionId,
                    action,
                    oldStatus,
                    newStatus,
                    reason,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: 'xendit-subscription-service'
                    }
                }
            });
        }
        catch (error) {
            this.logger.error('Error logging subscription history:', error);
        }
    }
};
exports.XenditSubscriptionService = XenditSubscriptionService;
exports.XenditSubscriptionService = XenditSubscriptionService = XenditSubscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], XenditSubscriptionService);
//# sourceMappingURL=xendit-subscription.service.js.map