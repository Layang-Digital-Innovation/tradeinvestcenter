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
var PaypalSubscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const paypal_config_1 = require("./paypal.config");
const client_1 = require("@prisma/client");
let PaypalSubscriptionService = PaypalSubscriptionService_1 = class PaypalSubscriptionService {
    constructor(prisma, configService, paypalConfigService) {
        this.prisma = prisma;
        this.configService = configService;
        this.paypalConfigService = paypalConfigService;
        this.logger = new common_1.Logger(PaypalSubscriptionService_1.name);
    }
    async createBillingPlan(plan, price, period, name) {
        try {
            const paypal = this.paypalConfigService.getPaypalSDK();
            let frequency = 'MONTH';
            let frequencyInterval = 1;
            const resolvedPeriod = period !== null && period !== void 0 ? period : (plan === client_1.SubscriptionPlan.GOLD_YEARLY ? 'YEARLY' : 'MONTHLY');
            if (resolvedPeriod === 'YEARLY') {
                frequency = 'YEAR';
                frequencyInterval = 1;
            }
            const billingPlanAttributes = {
                name: name !== null && name !== void 0 ? name : `Trade Invest Center ${plan}`,
                description: `Subscription plan for Trade Invest Center - ${name || plan}`,
                type: 'INFINITE',
                payment_definitions: [
                    {
                        name: 'Regular Payment',
                        type: 'REGULAR',
                        frequency: frequency,
                        frequency_interval: frequencyInterval.toString(),
                        amount: {
                            currency: 'USD',
                            value: price.toString()
                        },
                        cycles: '0'
                    }
                ],
                merchant_preferences: {
                    setup_fee: {
                        currency: 'USD',
                        value: '0'
                    },
                    return_url: `${this.configService.get('APP_URL')}/api/subscription/billing-agreement/execute`,
                    cancel_url: `${this.configService.get('APP_URL')}/api/subscription/payment/cancel`,
                    auto_bill_amount: 'YES',
                    initial_fail_amount_action: 'CONTINUE',
                    max_fail_attempts: '3'
                }
            };
            return new Promise((resolve, reject) => {
                paypal.billingPlan.create(billingPlanAttributes, (error, billingPlan) => {
                    if (error) {
                        this.logger.error(`PayPal Create Billing Plan Error: ${error.message}`);
                        reject(error);
                        return;
                    }
                    const billingPlanUpdateAttributes = {
                        op: 'replace',
                        path: '/',
                        value: {
                            state: 'ACTIVE'
                        }
                    };
                    paypal.billingPlan.update(billingPlan.id, [billingPlanUpdateAttributes], (updateError) => {
                        if (updateError) {
                            this.logger.error(`PayPal Update Billing Plan Error: ${updateError.message}`);
                            reject(updateError);
                            return;
                        }
                        (async () => {
                            try {
                                const created = await this.prisma.billingPlan.upsert({
                                    where: { provider_plan_period_currency: { provider: 'PAYPAL', plan, period: resolvedPeriod, currency: 'USD' } },
                                    update: {
                                        providerPlanId: billingPlan.id,
                                        name: name !== null && name !== void 0 ? name : billingPlan.name,
                                        description: `Subscription plan for Trade Invest Center - ${name || plan}`,
                                        price: price,
                                        currency: 'USD',
                                        status: billingPlan.state,
                                    },
                                    create: {
                                        provider: 'PAYPAL',
                                        providerPlanId: billingPlan.id,
                                        plan,
                                        name: name !== null && name !== void 0 ? name : billingPlan.name,
                                        description: `Subscription plan for Trade Invest Center - ${name || plan}`,
                                        price: price,
                                        currency: 'USD',
                                        period: resolvedPeriod,
                                        status: billingPlan.state,
                                    }
                                });
                                resolve({
                                    id: created.id,
                                    providerPlanId: billingPlan.id,
                                    name: created.name,
                                    status: created.status,
                                });
                            }
                            catch (dbErr) {
                                this.logger.error(`Failed to persist BillingPlan: ${dbErr.message}`);
                                resolve({
                                    id: billingPlan.id,
                                    name: billingPlan.name,
                                    status: billingPlan.state,
                                });
                            }
                        })();
                    });
                });
            });
        }
        catch (error) {
            this.logger.error(`Error creating PayPal billing plan: ${error.message}`);
            throw error;
        }
    }
    async createBillingAgreement(userId, planId, billingPlanId) {
        try {
            const paypal = this.paypalConfigService.getPaypalSDK();
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error(`User dengan ID ${userId} tidak ditemukan`);
            }
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            const billingAgreementAttributes = {
                name: 'Trade Invest Center Subscription Agreement',
                description: 'Billing Agreement for Trade Invest Center Subscription',
                start_date: startDate.toISOString(),
                plan: {
                    id: billingPlanId
                },
                payer: {
                    payment_method: 'paypal'
                },
                shipping_address: {
                    line1: 'No shipping address',
                    city: 'No City',
                    state: 'No State',
                    postal_code: '00000',
                    country_code: 'US'
                }
            };
            return new Promise((resolve, reject) => {
                paypal.billingAgreement.create(billingAgreementAttributes, async (error, billingAgreement) => {
                    if (error) {
                        this.logger.error(`PayPal Create Billing Agreement Error: ${error.message}`);
                        reject(error);
                        return;
                    }
                    try {
                        const agreementId = billingAgreement.id;
                        const now = new Date();
                        const existing = await this.prisma.subscription.findUnique({ where: { userId: userId } });
                        let subscription;
                        if (existing) {
                            subscription = await this.prisma.subscription.update({
                                where: { id: existing.id },
                                data: {
                                    plan: planId,
                                    status: client_1.SubscriptionStatus.TRIAL,
                                    startedAt: now,
                                    expiresAt: null,
                                }
                            });
                        }
                        else {
                            subscription = await this.prisma.subscription.create({
                                data: {
                                    userId: userId,
                                    plan: planId,
                                    status: client_1.SubscriptionStatus.TRIAL,
                                    startedAt: now,
                                    expiresAt: null
                                }
                            });
                        }
                        const approvalUrl = billingAgreement.links.find(link => link.rel === 'approval_url');
                        if (!approvalUrl) {
                            reject(new Error('Approval URL tidak ditemukan dari PayPal'));
                            return;
                        }
                        const urlObj = new URL(approvalUrl.href);
                        const urlToken = urlObj.searchParams.get('token') || undefined;
                        const urlBaToken = urlObj.searchParams.get('ba_token') || undefined;
                        await this.prisma.payment.create({
                            data: {
                                userId: userId,
                                provider: 'PAYPAL',
                                amount: 0,
                                status: 'PENDING',
                                subscriptionId: subscription.id,
                                externalId: null,
                                metadata: {
                                    agreementId: agreementId,
                                    subscriptionId: subscription.id,
                                    billingPlanId: billingPlanId,
                                    plan: planId,
                                    token: urlToken,
                                    ba_token: urlBaToken,
                                }
                            }
                        });
                        resolve({
                            id: subscription.id,
                            approval_url: approvalUrl.href,
                            status: subscription.status
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
            this.logger.error(`Error creating PayPal billing agreement: ${error.message}`);
            throw error;
        }
    }
    async executeBillingAgreement(token) {
        try {
            const paypal = this.paypalConfigService.getPaypalSDK();
            return new Promise((resolve, reject) => {
                paypal.billingAgreement.execute(token, {}, async (error, billingAgreement) => {
                    var _a, _b, _c, _d, _e;
                    if (error) {
                        this.logger.error(`PayPal Execute Billing Agreement Error: ${error.message}`);
                        reject(error);
                        return;
                    }
                    try {
                        const payment = await this.prisma.payment.findFirst({
                            where: {
                                OR: [
                                    { metadata: { path: ['token'], equals: token } },
                                    { metadata: { path: ['ba_token'], equals: token } },
                                    { externalId: billingAgreement.id },
                                    {
                                        metadata: {
                                            path: ['agreementId'],
                                            equals: billingAgreement.id
                                        }
                                    }
                                ]
                            }
                        });
                        if (!payment) {
                            reject(new Error(`Payment dengan agreement ID ${billingAgreement.id} tidak ditemukan`));
                            return;
                        }
                        const subscription = await this.prisma.subscription.findUnique({
                            where: { id: payment.subscriptionId }
                        });
                        if (!subscription) {
                            reject(new Error(`Subscription dengan ID ${payment.subscriptionId} tidak ditemukan`));
                            return;
                        }
                        const meta = payment.metadata || {};
                        const billingPlanId = meta === null || meta === void 0 ? void 0 : meta.billingPlanId;
                        const billingPlan = billingPlanId
                            ? await this.prisma.billingPlan.findFirst({ where: { providerPlanId: billingPlanId } })
                            : null;
                        const now = new Date();
                        let periodEnd = new Date(now);
                        if (subscription.plan === client_1.SubscriptionPlan.GOLD_MONTHLY) {
                            periodEnd.setMonth(periodEnd.getMonth() + 1);
                        }
                        else if (subscription.plan === client_1.SubscriptionPlan.GOLD_YEARLY) {
                            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                        }
                        else {
                            periodEnd.setDate(periodEnd.getDate() + 30);
                        }
                        const updatedSubscription = await this.prisma.subscription.update({
                            where: { id: subscription.id },
                            data: {
                                status: client_1.SubscriptionStatus.ACTIVE,
                                startedAt: (_a = subscription.startedAt) !== null && _a !== void 0 ? _a : now,
                                currentPeriodStart: now,
                                currentPeriodEnd: periodEnd,
                                trialEndsAt: null,
                                expiresAt: periodEnd,
                            }
                        });
                        await this.prisma.payment.update({
                            where: { id: payment.id },
                            data: {
                                status: 'PAID',
                                amount: (_c = (_b = billingPlan === null || billingPlan === void 0 ? void 0 : billingPlan.price) !== null && _b !== void 0 ? _b : payment.amount) !== null && _c !== void 0 ? _c : 0,
                                currency: (_e = (_d = billingPlan === null || billingPlan === void 0 ? void 0 : billingPlan.currency) !== null && _d !== void 0 ? _d : payment.currency) !== null && _e !== void 0 ? _e : 'USD',
                                externalId: billingAgreement.id,
                                metadata: Object.assign(Object.assign({}, payment.metadata), { billingAgreement: billingAgreement, executedAt: new Date().toISOString(), token: token })
                            }
                        });
                        resolve({
                            success: true,
                            subscription: updatedSubscription,
                            message: 'Subscription berhasil diaktifkan'
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
            this.logger.error(`Error executing PayPal billing agreement: ${error.message}`);
            throw error;
        }
    }
};
exports.PaypalSubscriptionService = PaypalSubscriptionService;
exports.PaypalSubscriptionService = PaypalSubscriptionService = PaypalSubscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        paypal_config_1.PaypalConfigService])
], PaypalSubscriptionService);
//# sourceMappingURL=paypal-subscription.service.js.map