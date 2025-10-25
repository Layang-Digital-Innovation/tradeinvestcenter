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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const paypal_config_1 = require("./paypal.config");
const xendit_subscription_service_1 = require("./xendit-subscription.service");
const xendit_node_1 = require("xendit-node");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(prisma, configService, paypalConfigService, xenditSubscriptionService) {
        this.prisma = prisma;
        this.configService = configService;
        this.paypalConfigService = paypalConfigService;
        this.xenditSubscriptionService = xenditSubscriptionService;
        this.logger = new common_1.Logger(PaymentService_1.name);
        this.xenditClient = new xendit_node_1.Xendit({
            secretKey: this.configService.get('XENDIT_SECRET_KEY'),
        });
    }
    async createPayment(data) {
        var _a;
        this.logger.log(`Creating payment for user ${data.userId}: ${data.amount} - ${data.description}`);
        let provider = client_1.PaymentProvider.XENDIT;
        const MANUAL_PROVIDER = 'MANUAL';
        if (data.paymentMethod.toLowerCase() === 'paypal') {
            provider = client_1.PaymentProvider.PAYPAL;
        }
        else if (data.paymentMethod.toLowerCase() === 'manual') {
            provider = MANUAL_PROVIDER;
        }
        const payment = await this.prisma.payment.create({
            data: {
                userId: data.userId,
                amount: data.amount,
                currency: (data.currency || (provider === client_1.PaymentProvider.PAYPAL ? client_1.Currency.USD : client_1.Currency.IDR)),
                provider: provider,
                status: client_1.PaymentStatus.PENDING,
                paymentType: client_1.PaymentType.ONE_TIME,
                description: data.description,
                subscriptionId: data.subscriptionId,
                labelId: data.labelId,
                invoiceNumber: data.invoiceNumber,
                metadata: data.metadata,
            },
        });
        if (provider === MANUAL_PROVIDER) {
            const awaitingApproval = !!(data.metadata && (data.metadata.awaitingApproval === true));
            return this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: awaitingApproval ? (_a = client_1.PaymentStatus.AWAITING_APPROVAL) !== null && _a !== void 0 ? _a : client_1.PaymentStatus.PENDING : client_1.PaymentStatus.PAID,
                    paidAt: awaitingApproval ? null : new Date(),
                    metadata: Object.assign({ note: 'Manual payment (Enterprise Label)', description: data.description }, (data.metadata || {})),
                },
            });
        }
        if (provider === client_1.PaymentProvider.PAYPAL) {
            try {
                const paypal = this.paypalConfigService.getPaypalSDK();
                const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
                const create_payment_json = {
                    intent: "sale",
                    payer: {
                        payment_method: "paypal"
                    },
                    redirect_urls: {
                        return_url: `${baseUrl}/api/subscription/payment/paypal/execute?paymentId=${payment.id}`,
                        cancel_url: `${baseUrl}/api/subscription/payment/cancel`
                    },
                    transactions: [{
                            amount: {
                                total: data.amount.toString(),
                                currency: data.currency || "USD"
                            },
                            description: data.description || "Trade Invest Center Subscription"
                        }]
                };
                return new Promise((resolve, reject) => {
                    paypal.payment.create(create_payment_json, (error, paypalPayment) => {
                        if (error) {
                            this.logger.error(`PayPal Create Payment Error: ${error.message}`);
                            reject(error);
                            return;
                        }
                        const approvalLink = paypalPayment.links.find(link => link.rel === "approval_url");
                        if (!approvalLink) {
                            reject(new Error("Approval URL tidak ditemukan dari PayPal"));
                            return;
                        }
                        this.prisma.payment.update({
                            where: { id: payment.id },
                            data: {
                                paymentLink: approvalLink.href,
                                externalId: paypalPayment.id,
                                metadata: {
                                    paymentLink: approvalLink.href,
                                    externalId: paypalPayment.id,
                                    description: data.description
                                },
                                providerData: JSON.parse(JSON.stringify(paypalPayment))
                            },
                        }).then(() => {
                            resolve({
                                id: payment.id,
                                approval_url: approvalLink.href,
                                status: client_1.PaymentStatus.PENDING
                            });
                        }).catch(err => {
                            reject(err);
                        });
                    });
                });
            }
            catch (error) {
                this.logger.error(`Error creating PayPal payment: ${error.message}`);
                throw error;
            }
        }
        else {
            try {
                const invoice = await this.xenditClient.Invoice.createInvoice({
                    data: {
                        externalId: `invoice_${payment.id}_${Date.now()}`,
                        amount: data.amount,
                        description: data.description || "Trade Invest Center Payment",
                        invoiceDuration: 86400,
                        currency: data.currency || "IDR",
                        reminderTime: 1,
                        successRedirectUrl: `${this.configService.get('APP_URL')}/payment/success`,
                        failureRedirectUrl: `${this.configService.get('APP_URL')}/payment/failed`,
                    }
                });
                const invoiceData = JSON.parse(JSON.stringify(invoice));
                return await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        paymentLink: invoice.invoiceUrl,
                        externalId: invoice.id,
                        metadata: Object.assign({ invoice: invoiceData, description: data.description, invoiceId: invoice.id, invoiceUrl: invoice.invoiceUrl, status: invoice.status, currency: invoice.currency, amount: invoice.amount, createdAt: invoice.created }, (data.metadata || {})),
                        providerData: invoiceData
                    },
                });
            }
            catch (error) {
                this.logger.error(`Error creating Xendit invoice: ${error.message}`);
                throw error;
            }
        }
    }
    async createSubscriptionPayment(data) {
        this.logger.log(`Creating subscription payment for user ${data.userId}: ${data.plan}`);
        if (data.paymentMethod.toLowerCase() === 'paypal') {
            throw new Error('Use PaypalSubscriptionService.createBillingAgreement for PayPal subscriptions');
        }
        else {
            return await this.xenditSubscriptionService.createSubscriptionPlan({
                userId: data.userId,
                plan: data.plan,
                price: data.price,
                currency: data.currency || 'IDR'
            });
        }
    }
    generatePaymentLink(paymentId, amount, provider) {
        const baseUrl = this.configService.get('PAYMENT_GATEWAY_URL') || 'https://payment.tradeinvestcenter.com';
        if (provider === client_1.PaymentProvider.PAYPAL) {
            return `${baseUrl}/paypal/${paymentId}?amount=${amount}`;
        }
        else {
            return `${baseUrl}/xendit/${paymentId}?amount=${amount}`;
        }
    }
    async verifyPayment(paymentId, transactionId) {
        this.logger.log(`Verifying payment ${paymentId} with transaction ${transactionId}`);
        return this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: client_1.PaymentStatus.PAID,
                paidAt: new Date(),
                metadata: {
                    transactionId: transactionId,
                    verifiedAt: new Date().toISOString()
                }
            },
        });
    }
    async executePaypalPayment(paymentId, payerId) {
        try {
            const payment = await this.prisma.payment.findUnique({
                where: { id: paymentId },
            });
            if (!payment) {
                throw new Error(`Payment dengan ID ${paymentId} tidak ditemukan`);
            }
            if (payment.status === client_1.PaymentStatus.PAID) {
                return { success: true, message: 'Pembayaran sudah diproses sebelumnya' };
            }
            const paypal = this.paypalConfigService.getPaypalSDK();
            const execute_payment_json = {
                payer_id: payerId
            };
            return new Promise((resolve, reject) => {
                const externalId = payment.externalId;
                if (!externalId) {
                    reject(new Error('External ID tidak ditemukan'));
                    return;
                }
                paypal.payment.execute(externalId, execute_payment_json, async (error, paypalPayment) => {
                    if (error) {
                        this.logger.error(`PayPal Execute Payment Error: ${error.message}`);
                        reject(error);
                        return;
                    }
                    try {
                        const updatedPayment = await this.prisma.payment.update({
                            where: { id: paymentId },
                            data: {
                                status: client_1.PaymentStatus.PAID,
                                paidAt: new Date(),
                                metadata: Object.assign(Object.assign({}, payment.metadata), { paypalPayment: JSON.parse(JSON.stringify(paypalPayment)), executedAt: new Date().toISOString(), payerId: payerId }),
                                providerData: JSON.parse(JSON.stringify(paypalPayment))
                            },
                        });
                        if (payment.subscriptionId) {
                            await this.prisma.subscription.update({
                                where: { id: payment.subscriptionId },
                                data: {
                                    status: client_1.SubscriptionStatus.ACTIVE,
                                    startedAt: new Date(),
                                    currentPeriodStart: new Date(),
                                    currentPeriodEnd: this.calculatePeriodEnd(new Date(), 'MONTHLY')
                                },
                            });
                        }
                        resolve({
                            success: true,
                            payment: updatedPayment,
                            message: 'Pembayaran berhasil diproses'
                        });
                    }
                    catch (dbError) {
                        this.logger.error(`Database Error: ${dbError.message}`);
                        reject(dbError);
                    }
                });
            });
        }
        catch (error) {
            this.logger.error(`Error executing PayPal payment: ${error.message}`);
            throw error;
        }
    }
    async handleXenditWebhook(eventType, data) {
        this.logger.log(`Received Xendit webhook: ${eventType}`);
        try {
            if (eventType.startsWith('recurring.')) {
                return await this.xenditSubscriptionService.handleSubscriptionWebhook(eventType, data);
            }
            else if (eventType === 'invoice.paid') {
                const payment = await this.prisma.payment.findFirst({
                    where: { externalId: data.id }
                });
                if (payment) {
                    await this.prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: client_1.PaymentStatus.PAID,
                            paidAt: new Date(data.paid_at || new Date()),
                            metadata: Object.assign(Object.assign({}, payment.metadata), { webhookData: JSON.parse(JSON.stringify(data)), paidAt: data.paid_at, updatedAt: new Date().toISOString() }),
                            webhookData: JSON.parse(JSON.stringify(data))
                        }
                    });
                    if (payment.subscriptionId) {
                        await this.prisma.subscription.update({
                            where: { id: payment.subscriptionId },
                            data: {
                                status: client_1.SubscriptionStatus.ACTIVE,
                                startedAt: new Date(),
                                currentPeriodStart: new Date(),
                                currentPeriodEnd: this.calculatePeriodEnd(new Date(), 'MONTHLY')
                            }
                        });
                    }
                }
            }
            else if (eventType === 'invoice.expired' || eventType === 'invoice.failed') {
                const payment = await this.prisma.payment.findFirst({
                    where: { externalId: data.id }
                });
                if (payment) {
                    await this.prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: client_1.PaymentStatus.FAILED,
                            failedAt: new Date(),
                            failureReason: data.failure_code || 'Unknown error',
                            metadata: Object.assign(Object.assign({}, payment.metadata), { webhookData: JSON.parse(JSON.stringify(data)), failedAt: new Date().toISOString(), failureReason: data.failure_code || 'Unknown error' }),
                            webhookData: JSON.parse(JSON.stringify(data))
                        }
                    });
                    if (payment.subscriptionId) {
                        await this.prisma.subscription.update({
                            where: { id: payment.subscriptionId },
                            data: {
                                status: client_1.SubscriptionStatus.EXPIRED,
                            }
                        });
                    }
                }
            }
            return { success: true, message: 'Webhook processed successfully' };
        }
        catch (error) {
            this.logger.error(`Error handling Xendit webhook: ${error.message}`);
            throw error;
        }
    }
    async getPaymentById(paymentId) {
        return this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                subscription: true,
                user: {
                    select: { id: true, email: true }
                }
            }
        });
    }
    async getUserPayments(userId) {
        return this.prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                subscription: true
            }
        });
    }
    async cancelSubscription(subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({ where: { id: subscriptionId } });
        if (!subscription) {
            throw new Error('Subscription tidak ditemukan');
        }
        const payment = await this.prisma.payment.findFirst({
            where: { subscriptionId },
            orderBy: { createdAt: 'desc' },
        });
        if (!payment) {
            throw new Error('Payment record tidak ditemukan untuk subscription ini');
        }
        if (payment.provider === client_1.PaymentProvider.XENDIT) {
            await this.xenditSubscriptionService.cancelSubscription(subscriptionId);
        }
        else {
            throw new Error('PayPal subscription cancellation not implemented yet');
        }
        await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: { status: client_1.SubscriptionStatus.CANCELLED, cancelledAt: new Date(), autoRenew: false },
        });
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                metadata: Object.assign(Object.assign({}, payment.metadata), { cancelledAt: new Date().toISOString(), cancelledBy: 'user' }),
            },
        });
        return { success: true, message: 'Subscription berhasil dibatalkan' };
    }
    async getSubscriptionDetails(subscriptionId) {
        return this.prisma.subscription.findUnique({
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
    async hasActiveSubscription(userId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId: userId,
                status: client_1.SubscriptionStatus.ACTIVE,
                expiresAt: {
                    gt: new Date()
                }
            }
        });
        return !!subscription;
    }
    async getUserActiveSubscription(userId) {
        return this.prisma.subscription.findFirst({
            where: {
                userId: userId,
                status: client_1.SubscriptionStatus.ACTIVE,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });
    }
    calculatePeriodEnd(startDate, planType) {
        const endDate = new Date(startDate);
        if (planType.includes('YEARLY')) {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        else {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        return endDate;
    }
    async logSubscriptionHistory(subscriptionId, action, oldStatus, newStatus, reason, metadata) {
        try {
            await this.prisma.subscriptionHistory.create({
                data: {
                    subscriptionId,
                    action: action,
                    oldStatus: oldStatus,
                    newStatus: newStatus,
                    reason,
                    metadata: metadata
                }
            });
        }
        catch (error) {
            this.logger.warn(`Failed to log subscription history: ${error.message}`);
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        paypal_config_1.PaypalConfigService,
        xendit_subscription_service_1.XenditSubscriptionService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map