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
var SubscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const payment_service_1 = require("./payment.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
let SubscriptionService = SubscriptionService_1 = class SubscriptionService {
    constructor(prisma, paymentService) {
        this.prisma = prisma;
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(SubscriptionService_1.name);
    }
    async updateBillingPlan(id, data) {
        const existing = await this.prisma.billingPlan.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Billing plan not found');
        let planVal = undefined;
        if (typeof data.plan === 'string' && data.plan.length > 0) {
            const up = data.plan.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(client_1.SubscriptionPlan, up))
                planVal = client_1.SubscriptionPlan[up];
            else
                planVal = up;
        }
        else if (data.plan) {
            planVal = data.plan;
        }
        let providerVal = undefined;
        if (typeof data.provider === 'string' && data.provider.length > 0) {
            const up = data.provider.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(client_1.PaymentProvider, up))
                providerVal = client_1.PaymentProvider[up];
            else
                providerVal = up;
        }
        else if (data.provider) {
            providerVal = data.provider;
        }
        let periodVal = undefined;
        if (typeof data.period === 'string' && data.period.length > 0) {
            const up = data.period.toUpperCase();
            periodVal = up === 'YEARLY' ? 'YEARLY' : (up === 'MONTHLY' ? 'MONTHLY' : undefined);
        }
        const updated = await this.prisma.billingPlan.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: typeof data.price === 'number' ? data.price : undefined,
                currency: data.currency,
                period: periodVal,
                status: data.status,
                plan: planVal,
                provider: providerVal,
            }
        });
        return {
            id: updated.id,
            provider: updated.provider,
            providerPlanId: updated.providerPlanId,
            plan: updated.plan,
            name: updated.name,
            description: updated.description,
            price: updated.price,
            currency: updated.currency,
            period: updated.period,
            status: updated.status,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }
    async deleteBillingPlan(id) {
        const existing = await this.prisma.billingPlan.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Billing plan not found');
        await this.prisma.billingPlan.delete({ where: { id } });
        return { success: true };
    }
    async createLocalBillingPlan(params) {
        const { plan, price } = params;
        if (typeof price !== 'number' || price <= 0)
            throw new common_1.BadRequestException('Invalid price');
        const planUp = String(plan || '').toUpperCase();
        const planVal = (Object.prototype.hasOwnProperty.call(require('@prisma/client').SubscriptionPlan, planUp)
            ? (require('@prisma/client').SubscriptionPlan[planUp])
            : planUp);
        const periodUp = String(params.period || 'MONTHLY').toUpperCase();
        const periodVal = periodUp === 'YEARLY' ? 'YEARLY' : 'MONTHLY';
        const currencyUp = String(params.currency || 'IDR').toUpperCase();
        const currencyVal = (Object.prototype.hasOwnProperty.call(require('@prisma/client').Currency, currencyUp)
            ? (require('@prisma/client').Currency[currencyUp])
            : currencyUp);
        const providerUp = String(params.provider || (currencyUp === 'USD' ? 'PAYPAL' : 'XENDIT')).toUpperCase();
        const providerVal = (Object.prototype.hasOwnProperty.call(require('@prisma/client').PaymentProvider, providerUp)
            ? (require('@prisma/client').PaymentProvider[providerUp])
            : providerUp);
        const name = params.name || undefined;
        const status = params.status || 'ACTIVE';
        const created = await this.prisma.billingPlan.upsert({
            where: {
                provider_plan_period_currency: {
                    provider: providerVal,
                    plan: planVal,
                    period: periodVal,
                    currency: currencyVal,
                }
            },
            update: {
                price: price,
                name: name,
                status: status,
            },
            create: {
                provider: providerVal,
                plan: planVal,
                price: price,
                currency: currencyVal,
                period: periodVal,
                name: name,
                status: status,
            }
        });
        return {
            id: created.id,
            provider: created.provider,
            plan: created.plan,
            name: created.name,
            price: created.price,
            currency: created.currency,
            period: created.period,
            status: created.status,
        };
    }
    async getSubscriptionPlans() {
        const plans = await this.prisma.billingPlan.findMany({
            where: {
                OR: [
                    { status: { equals: 'ACTIVE' } },
                    { status: { equals: 'CREATED' } },
                    { status: null },
                ],
            },
            orderBy: [{ plan: 'asc' }, { period: 'asc' }],
        });
        return plans.map((p) => ({
            id: p.id,
            provider: p.provider,
            providerPlanId: p.providerPlanId,
            plan: p.plan,
            name: p.name,
            description: p.description,
            price: p.price,
            currency: p.currency,
            period: p.period,
            status: p.status,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
    async expirePastDueSubscriptions() {
        const now = new Date();
        const overdue = await this.prisma.subscription.findMany({
            where: {
                status: client_1.SubscriptionStatus.ACTIVE,
                OR: [
                    { currentPeriodEnd: { lt: now } },
                    { expiresAt: { lt: now } },
                ],
            },
            select: { id: true, userId: true, currentPeriodEnd: true, expiresAt: true },
        });
        let updated = 0;
        for (const s of overdue) {
            try {
                await this.prisma.subscription.update({
                    where: { id: s.id },
                    data: { status: client_1.SubscriptionStatus.EXPIRED },
                });
                updated++;
            }
            catch (e) {
                this.logger.warn(`Failed to expire subscription ${s.id}: ${e === null || e === void 0 ? void 0 : e.message}`);
            }
        }
        this.logger.log(`Auto-expired subscriptions: ${updated} / ${overdue.length}`);
        return { totalCandidates: overdue.length, updated };
    }
    async notifyEnterpriseCustomExpiringHMinus1() {
        var _a, _b, _c;
        const now = new Date();
        const start = new Date(now);
        start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        const expiring = await this.prisma.subscription.findMany({
            where: {
                status: client_1.SubscriptionStatus.ACTIVE,
                plan: client_1.SubscriptionPlan.ENTERPRISE_CUSTOM,
                OR: [
                    { currentPeriodEnd: { gte: start, lte: end } },
                    { expiresAt: { gte: start, lte: end } },
                ],
            },
            include: {
                user: { select: { id: true, email: true } },
                label: { select: { id: true, name: true, code: true } },
            },
        });
        const superAdmins = await this.prisma.user.findMany({ where: { role: 'SUPER_ADMIN' }, select: { id: true, email: true } });
        let userNotifs = 0;
        let adminNotifs = 0;
        for (const s of expiring) {
            try {
                await this.prisma.notification.create({
                    data: {
                        userId: s.userId,
                        title: 'Langganan Enterprise akan berakhir besok',
                        message: `Akses Enterprise (${((_a = s.label) === null || _a === void 0 ? void 0 : _a.name) || 'Organisasi'}) akan berakhir dalam 1 hari. Mohon lakukan perpanjangan.`,
                        type: 'ENTERPRISE_EXPIRY',
                        relatedId: s.id,
                        metadata: { labelId: (_b = s.label) === null || _b === void 0 ? void 0 : _b.id, labelName: (_c = s.label) === null || _c === void 0 ? void 0 : _c.name, currentPeriodEnd: s.currentPeriodEnd, expiresAt: s.expiresAt },
                    },
                });
                userNotifs++;
            }
            catch (e) {
                this.logger.warn(`Failed to notify user ${s.userId} enterprise expiry: ${e === null || e === void 0 ? void 0 : e.message}`);
            }
        }
        if (expiring.length > 0 && superAdmins.length > 0) {
            for (const admin of superAdmins) {
                try {
                    await this.prisma.notification.create({
                        data: {
                            userId: admin.id,
                            title: 'Enterprise subscriptions expiring H-1',
                            message: `Ada ${expiring.length} subscription Enterprise Custom yang akan berakhir besok.`,
                            type: 'ENTERPRISE_EXPIRY_ADMIN',
                            metadata: { items: expiring.map(e => { var _a; return ({ subscriptionId: e.id, userEmail: e.user.email, labelName: (_a = e.label) === null || _a === void 0 ? void 0 : _a.name, currentPeriodEnd: e.currentPeriodEnd, expiresAt: e.expiresAt }); }) },
                        },
                    });
                    adminNotifs++;
                }
                catch (e) {
                    this.logger.warn(`Failed to notify admin ${admin.id} enterprise expiry: ${e === null || e === void 0 ? void 0 : e.message}`);
                }
            }
        }
        this.logger.log(`Enterprise expiry H-1 notifications -> users: ${userNotifs}, admins: ${adminNotifs}, candidates: ${expiring.length}`);
        return { totalCandidates: expiring.length, userNotifications: userNotifs, adminNotifications: adminNotifs };
    }
    async approveManualOrgPayment(paymentId, approverUserId) {
        var _a;
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        const meta = payment.metadata || {};
        if (meta.mode !== 'ORG_INVOICE')
            throw new common_1.BadRequestException('Not an ORG_INVOICE payment');
        const newMeta = Object.assign(Object.assign({}, meta), { awaitingApproval: false, approved: true, approvedAt: new Date().toISOString(), approvedBy: approverUserId });
        await this.prisma.payment.update({ where: { id: payment.id }, data: { status: (_a = client_1.PaymentStatus.PAID) !== null && _a !== void 0 ? _a : 'PAID', paidAt: new Date(), metadata: newMeta } });
        await this.activateBulkFromOrgInvoice({
            labelId: meta.labelId,
            userIds: Array.isArray(meta.userIds) ? meta.userIds : [],
            pricePerUser: meta.pricePerUser || 0,
            currency: meta.currency || 'IDR',
            period: meta.period || 'MONTHLY'
        });
        return { success: true };
    }
    async failManualOrgPayment(params) {
        const { paymentId, reason, expireSubscriptions = false } = params;
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        const meta = payment.metadata || {};
        if (meta.mode !== 'ORG_INVOICE')
            throw new common_1.BadRequestException('Not an ORG_INVOICE payment');
        await this.prisma.payment.update({ where: { id: payment.id }, data: { status: client_1.PaymentStatus.FAILED, failedAt: new Date(), failureReason: reason } });
        if (expireSubscriptions && Array.isArray(meta.userIds)) {
            for (const userId of meta.userIds) {
                const existing = await this.prisma.subscription.findUnique({ where: { userId } });
                if (existing) {
                    await this.prisma.subscription.update({ where: { id: existing.id }, data: { status: client_1.SubscriptionStatus.EXPIRED, currentPeriodEnd: new Date() } });
                }
            }
        }
        return { success: true };
    }
    async createOrgInvoiceForLabel(params) {
        let { adminUserId, labelId, userIds, pricePerUser, totalAmount, currency = 'IDR', period, provider = 'xendit', description, invoiceNumber, referenceNumber, bankName, paidBy, notes, awaitingApproval = false, additionalSeats = false } = params;
        if (provider === 'manual') {
            awaitingApproval = true;
        }
        if (!userIds || userIds.length === 0)
            throw new common_1.BadRequestException('userIds is required');
        const label = await this.prisma.enterpriseLabel.findUnique({ where: { id: labelId } });
        if (!label)
            throw new common_1.NotFoundException('Enterprise label not found');
        const amountToCharge = typeof totalAmount === 'number' && totalAmount > 0
            ? totalAmount
            : (pricePerUser * userIds.length);
        const desc = description || `Enterprise Custom (${label.name}) ${period} • ${userIds.length} users`;
        if (!invoiceNumber) {
            const y = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
            invoiceNumber = `INV-${y}-${(label.code || label.name || 'ORG').toString().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}-${rand}`;
        }
        const payment = await this.paymentService.createPayment({
            userId: adminUserId,
            amount: amountToCharge,
            description: desc,
            paymentMethod: provider === 'manual' ? 'manual' : 'xendit',
            currency,
            labelId,
            invoiceNumber,
            metadata: {
                mode: 'ORG_INVOICE',
                labelId,
                userIds,
                pricePerUser,
                totalAmount: typeof totalAmount === 'number' ? totalAmount : undefined,
                currency,
                period,
                awaitingApproval,
                referenceNumber,
                bankName,
                paidBy,
                notes,
                additionalSeats,
            },
        });
        return payment;
    }
    async activateBulkFromOrgInvoice(params) {
        const { labelId, userIds, pricePerUser, currency = 'IDR', period } = params;
        const now = new Date();
        const periodEnd = this.calculatePeriodEnd(now, period);
        const ENTERPRISE_CUSTOM_PLAN = 'ENTERPRISE_CUSTOM';
        for (const userId of userIds) {
            const existing = await this.prisma.subscription.findUnique({ where: { userId } });
            if (existing) {
                await this.prisma.subscription.update({
                    where: { id: existing.id },
                    data: {
                        plan: ENTERPRISE_CUSTOM_PLAN,
                        status: client_1.SubscriptionStatus.ACTIVE,
                        startedAt: now,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                        customPrice: pricePerUser,
                        customCurrency: currency,
                        labelId,
                    },
                });
            }
            else {
                await this.prisma.subscription.create({
                    data: {
                        userId,
                        plan: ENTERPRISE_CUSTOM_PLAN,
                        status: client_1.SubscriptionStatus.ACTIVE,
                        startedAt: now,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                        customPrice: pricePerUser,
                        customCurrency: currency,
                        labelId,
                    },
                });
            }
        }
        this.logger.log(`Activated ${userIds.length} subscriptions for label ${labelId} via ORG_INVOICE`);
        return { labelId, count: userIds.length };
    }
    async createOrgInvoiceRenewalFromPayment(params) {
        const { adminUserId, previousPaymentId, period = 'MONTHLY', currency = 'IDR', totalAmount, pricePerUser = 0, provider = 'xendit', description, invoiceNumber, referenceNumber, bankName, paidBy, notes, awaitingApproval = provider === 'manual' } = params;
        const prev = await this.prisma.payment.findUnique({ where: { id: previousPaymentId } });
        if (!prev)
            throw new common_1.NotFoundException('Previous payment not found');
        const meta = prev.metadata || {};
        if (meta.mode !== 'ORG_INVOICE')
            throw new common_1.BadRequestException('Previous payment is not an ORG_INVOICE');
        const labelId = meta.labelId;
        const userIds = Array.isArray(meta.userIds) ? meta.userIds : [];
        if (!labelId || userIds.length === 0)
            throw new common_1.BadRequestException('Previous payment missing labelId or userIds');
        const label = await this.prisma.enterpriseLabel.findUnique({ where: { id: labelId } });
        if (!label)
            throw new common_1.NotFoundException('Enterprise label not found');
        const amountToCharge = typeof totalAmount === 'number' && totalAmount > 0
            ? totalAmount
            : (pricePerUser * userIds.length);
        const desc = description || `Enterprise Custom (${label.name}) ${period} • Renewal • ${userIds.length} users`;
        const payment = await this.paymentService.createPayment({
            userId: adminUserId,
            amount: amountToCharge,
            description: desc,
            paymentMethod: provider === 'manual' ? 'manual' : 'xendit',
            currency,
            labelId,
            invoiceNumber,
            metadata: {
                mode: 'ORG_INVOICE',
                labelId,
                userIds,
                pricePerUser,
                totalAmount: typeof totalAmount === 'number' ? totalAmount : undefined,
                currency,
                period,
                awaitingApproval,
                referenceNumber,
                bankName,
                paidBy,
                notes,
                renewalOfPaymentId: prev.id,
            },
        });
        return payment;
    }
    async getUserSubscription(userId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
            },
            orderBy: {
                startedAt: 'desc',
            },
        });
        return subscription;
    }
    async createSubscription(userId, planId, paymentMethod) {
        const plans = await this.getSubscriptionPlans();
        const plan = plans.find(p => p.id === planId);
        if (!plan) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        const payment = await this.paymentService.createPayment({
            userId,
            amount: 0,
            description: `Subscription to ${plan.plan} plan`,
            paymentMethod,
        });
        const subscription = await this.prisma.subscription.create({
            data: {
                userId,
                plan: plan.plan,
                status: client_1.SubscriptionStatus.TRIAL,
                startedAt: new Date(),
            },
        });
        return {
            subscription,
            payment,
        };
    }
    async activateSubscription(subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status !== client_1.SubscriptionStatus.TRIAL) {
            throw new common_1.BadRequestException('Subscription is not in trial status');
        }
        return this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: client_1.SubscriptionStatus.ACTIVE,
            },
        });
    }
    async cancelSubscription(subscriptionId, userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to cancel this subscription');
        }
        return this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: client_1.SubscriptionStatus.EXPIRED,
            },
        });
    }
    async processPayment(paymentId) {
        return { status: 'success' };
    }
    async checkSubscriptionAccess(userId, requiredPlan) {
        var _a, _b;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
            return true;
        }
        const subscription = await this.getUserSubscription(userId);
        if (!subscription) {
            return false;
        }
        const now = new Date();
        if (subscription.status === client_1.SubscriptionStatus.TRIAL) {
            const trialEnd = (_a = subscription.trialEndsAt) !== null && _a !== void 0 ? _a : subscription.expiresAt;
            if (!trialEnd || trialEnd <= now) {
                return false;
            }
            return requiredPlan === client_1.SubscriptionPlan.TRIAL;
        }
        const isActive = subscription.status === client_1.SubscriptionStatus.ACTIVE;
        const periodEnd = (_b = subscription.currentPeriodEnd) !== null && _b !== void 0 ? _b : subscription.expiresAt;
        const isNotExpired = !!periodEnd && periodEnd > now;
        if (!isActive || !isNotExpired) {
            return false;
        }
        const planLevels = {
            [client_1.SubscriptionPlan.TRIAL]: 1,
            [client_1.SubscriptionPlan.GOLD_MONTHLY]: 2,
            [client_1.SubscriptionPlan.GOLD_YEARLY]: 3,
            [client_1.SubscriptionPlan.ENTERPRISE_CUSTOM]: 4,
        };
        return planLevels[subscription.plan] >= planLevels[requiredPlan];
    }
    async getAllSubscriptions() {
        return this.prisma.subscription.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                        role: true,
                        labelInvestors: {
                            include: { label: { select: { id: true, name: true } } }
                        }
                    }
                },
                label: {
                    select: { id: true, name: true }
                },
            }
        });
    }
    async createEnterpriseLabel(data) {
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Label name is required');
        }
        const baseCode = data.name.trim().toUpperCase().replace(/\s+/g, '_');
        const uniqueSuffix = Date.now().toString(36);
        const code = `${baseCode}_${uniqueSuffix}`;
        const label = await this.prisma.enterpriseLabel.create({
            data: {
                name: data.name,
                description: data.description,
                code,
            }
        });
        this.logger.log(`Enterprise label created: ${label.name} (${label.id})`);
        return label;
    }
    async getEnterpriseLabels() {
        return this.prisma.enterpriseLabel.findMany();
    }
    async updateEnterpriseLabel(id, data) {
        const existing = await this.prisma.enterpriseLabel.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Enterprise label not found');
        const updated = await this.prisma.enterpriseLabel.update({ where: { id }, data: { name: data.name, description: data.description } });
        return updated;
    }
    async deleteEnterpriseLabel(id) {
        const existing = await this.prisma.enterpriseLabel.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Enterprise label not found');
        await this.prisma.enterpriseLabel.delete({ where: { id } });
        return { success: true };
    }
    async buildInvoiceHtml(paymentId) {
        var _a;
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { label: true }
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        const meta = payment.metadata || {};
        if (meta.mode !== 'ORG_INVOICE')
            throw new common_1.BadRequestException('Not an ORG_INVOICE payment');
        const orgName = ((_a = payment.label) === null || _a === void 0 ? void 0 : _a.name) || meta.paidBy || '-';
        const invoiceNo = payment.invoiceNumber || meta.invoiceNumber || payment.id;
        const createdAt = payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '';
        const status = payment.status;
        const currency = payment.currency || 'IDR';
        const amount = payment.amount || 0;
        const usersCount = Array.isArray(meta.userIds) ? meta.userIds.length : (meta.usersCount || 1);
        const period = meta.period || 'MONTHLY';
        const planText = `Enterprise Custom ${period}${meta.additionalSeats ? ' - additional seats' : ''} - ${usersCount} users`;
        const bankInfoLines = [
            meta.bankName ? `Bank: ${meta.bankName}` : '',
            meta.bankAccountName ? `Account Name: ${meta.bankAccountName}` : '',
            meta.bankAccountNumber ? `Account Number: ${meta.bankAccountNumber}` : '',
            meta.bankInstruction ? `Instruction: ${meta.bankInstruction}` : ''
        ].filter(Boolean);
        const notes = meta.notes ? String(meta.notes) : '';
        const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
        const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoiceNo}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; padding: 24px; }
    .header { display:flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 20px; font-weight: 700; color: #4b2aad; }
    .inv-box { margin-top: 8px; }
    .muted { color: #666; }
    .card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin-top:16px; }
    .row { display:flex; gap:16px; }
    .col { flex:1; }
    table { width:100%; border-collapse: collapse; margin-top:8px; table-layout: fixed; }
    th, td { padding:8px; border-bottom:1px solid #eee; vertical-align: top; }
    th.item, td.item { text-align:left; }
    th.qty, td.qty { text-align:right; width: 80px; }
    th.unit, td.unit { text-align:right; width: 160px; }
    th.total, td.total { text-align:right; width: 160px; }
    .tot-label { text-align:right; font-weight:700; }
    .badge { display:inline-block; padding:2px 8px; border-radius:9999px; font-size:12px; border:1px solid #ddd; }
  </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">Trade Invest Center</div>
        <div class="muted">PT. Layang Digital Innovation</div>
      </div>
      <div class="inv-box">
        <div><strong>Invoice:</strong> ${invoiceNo}</div>
        <div><strong>Date:</strong> ${createdAt}</div>
        <div><strong>Status:</strong> <span class="badge">${status}</span></div>
      </div>
    </div>

    <div class="card row">
      <div class="col">
        <div class="muted">Billed To</div>
        <div><strong>${orgName}</strong></div>
        ${meta.paidBy ? `<div>${meta.paidBy}</div>` : ''}
      </div>
      <div class="col">
        <div class="muted">Description</div>
        <div>${planText}</div>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th class="item">Item</th>
            <th class="qty">Qty</th>
            <th class="unit">Unit Price</th>
            <th class="total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="item">Subscription seats</td>
            <td class="qty">${usersCount}</td>
            <td class="unit">${fmt((meta.totalAmount && usersCount) ? (meta.totalAmount / usersCount) : (meta.pricePerUser || amount))}</td>
            <td class="total">${fmt(amount || meta.totalAmount || (usersCount * (meta.pricePerUser || 0)))}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="tot-label">Grand Total</td>
            <td class="total">${fmt(amount || meta.totalAmount || 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    ${bankInfoLines.length ? `<div class="card"><div class="muted">Bank Transfer</div><div>${bankInfoLines.join('<br/>')}</div></div>` : ''}
    ${notes ? `<div class="card"><div class="muted">Notes</div><div>${notes}</div></div>` : ''}

  </body>
</html>`;
        return { payment, html, filename: `invoice-${invoiceNo}.html` };
    }
    async streamInvoicePdf(res, paymentId) {
        var _a;
        let PDFDocument;
        try {
            PDFDocument = require('pdfkit');
        }
        catch (_b) {
            throw new common_1.BadRequestException('PDF generator not available');
        }
        const { payment, filename } = await this.buildInvoiceHtml(paymentId);
        const meta = payment.metadata || {};
        const doc = new PDFDocument({ size: 'A4', margin: 48 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/\.html$/, '.pdf')}"`);
        doc.pipe(res);
        doc.fillColor('#4b2aad').fontSize(20).text('Trade Invest Center', { continued: false });
        doc.fillColor('#444').fontSize(10).text('PT. Layang Digital Innovation');
        const invoiceNo = payment.invoiceNumber || meta.invoiceNumber || payment.id;
        const createdAt = payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '';
        doc.moveDown(0.5);
        doc.fillColor('#000').fontSize(12).text(`Invoice: ${invoiceNo}`);
        doc.text(`Date: ${createdAt}`);
        doc.text(`Status: ${payment.status}`);
        doc.moveDown();
        const orgName = ((_a = payment.label) === null || _a === void 0 ? void 0 : _a.name) || meta.paidBy || '-';
        doc.fontSize(11).fillColor('#666').text('Billed To');
        doc.fillColor('#000').text(orgName);
        const usersCount = Array.isArray(meta.userIds) ? meta.userIds.length : (meta.usersCount || 1);
        const period = meta.period || 'MONTHLY';
        const planText = `Enterprise Custom ${period}${meta.additionalSeats ? ' - additional seats' : ''} - ${usersCount} users`;
        doc.moveDown(0.5);
        doc.fillColor('#666').text('Description');
        doc.fillColor('#000').text(planText);
        doc.moveDown();
        const currency = payment.currency || 'IDR';
        const amount = payment.amount || 0;
        const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
        const unitPrice = (meta.totalAmount && usersCount) ? (meta.totalAmount / usersCount) : (meta.pricePerUser || amount);
        const total = amount || meta.totalAmount || (usersCount * (meta.pricePerUser || 0));
        const marginLeft = 48;
        const itemX = marginLeft;
        const qtyX = 280;
        const qtyW = 40;
        const unitX = 340;
        const unitW = 100;
        const totalX = 460;
        const totalW = 100;
        doc.fontSize(12).text('Item', itemX);
        doc.moveUp().text('Qty', qtyX, undefined, { width: qtyW, align: 'right' });
        doc.moveUp().text('Unit Price', unitX, undefined, { width: unitW, align: 'right' });
        doc.moveUp().text('Total', totalX, undefined, { width: totalW, align: 'right' });
        doc.moveDown(0.2);
        doc.strokeColor('#eee').moveTo(48, doc.y).lineTo(560, doc.y).stroke();
        doc.moveDown(0.4);
        doc.fillColor('#000').text('Subscription seats', itemX);
        doc.moveUp().text(String(usersCount), qtyX, undefined, { width: qtyW, align: 'right' });
        doc.moveUp().text(fmt(unitPrice), unitX, undefined, { width: unitW, align: 'right' });
        doc.moveUp().text(fmt(total), totalX, undefined, { width: totalW, align: 'right' });
        doc.moveDown(0.4);
        doc.strokeColor('#eee').moveTo(48, doc.y).lineTo(560, doc.y).stroke();
        doc.moveDown(0.6);
        const labelWidth = totalX - unitX - 10;
        doc.font('Helvetica-Bold').text('Grand Total', unitX, doc.y, { width: labelWidth, align: 'right' });
        doc.text(fmt(total), totalX, undefined, { width: totalW, align: 'right' });
        doc.font('Helvetica');
        const bankInfo = [];
        if (meta.bankName)
            bankInfo.push(`Bank: ${meta.bankName}`);
        if (meta.bankAccountName)
            bankInfo.push(`Account Name: ${meta.bankAccountName}`);
        if (meta.bankAccountNumber)
            bankInfo.push(`Account Number: ${meta.bankAccountNumber}`);
        if (meta.bankInstruction)
            bankInfo.push(`Instruction: ${meta.bankInstruction}`);
        if (bankInfo.length) {
            doc.moveDown();
            doc.fillColor('#666').text('Bank Transfer');
            doc.fillColor('#000').text(bankInfo.join('\n'));
        }
        if (meta.notes) {
            doc.moveDown();
            doc.fillColor('#666').text('Notes');
            doc.fillColor('#000').text(String(meta.notes));
        }
        doc.end();
    }
    async bulkCreateInvestorsForLabel(params) {
        const { labelId, investors, defaultPassword = 'password123', requireUniqueEmail = true } = params;
        const label = await this.prisma.enterpriseLabel.findUnique({ where: { id: labelId } });
        if (!label)
            throw new common_1.NotFoundException('Enterprise label not found');
        const results = [];
        for (const inv of investors) {
            const email = inv.email.toLowerCase().trim();
            if (requireUniqueEmail) {
                const existing = await this.prisma.user.findUnique({ where: { email } });
                if (existing) {
                    await this.ensureLabelInvestor(labelId, existing.id);
                    results.push({ userId: existing.id, email, created: false, reason: 'Email already exists, linked to label' });
                }
                else {
                    continue;
                }
            }
            const plainPassword = inv.password || defaultPassword;
            const passwordHash = await bcrypt.hash(plainPassword, 10);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: passwordHash,
                    role: client_1.Role.INVESTOR,
                    fullname: inv.fullName,
                }
            });
            await this.ensureLabelInvestor(labelId, user.id);
            results.push({ userId: user.id, email, created: true });
        }
        this.logger.log(`Bulk create investors for label ${labelId} completed: ${results.length} processed`);
        return { labelId, count: results.length, results };
    }
    async ensureLabelInvestor(labelId, userId) {
        const existing = await this.prisma.labelInvestor.findFirst({
            where: { labelId, userId }
        });
        if (existing)
            return existing;
        return this.prisma.labelInvestor.create({
            data: { labelId, userId }
        });
    }
    async bulkSubscribeInvestorsForLabel(params) {
        const { labelId, userIds, price, currency = 'IDR', autoActivate = true, period = 'MONTHLY' } = params;
        const label = await this.prisma.enterpriseLabel.findUnique({ where: { id: labelId } });
        if (!label)
            throw new common_1.NotFoundException('Enterprise label not found');
        const ENTERPRISE_CUSTOM_PLAN = 'ENTERPRISE_CUSTOM';
        const now = new Date();
        const results = [];
        for (const userId of userIds) {
            const existing = await this.prisma.subscription.findUnique({ where: { userId } });
            let subscription;
            const periodEnd = this.calculatePeriodEnd(now, period);
            if (existing) {
                subscription = await this.prisma.subscription.update({
                    where: { id: existing.id },
                    data: {
                        plan: ENTERPRISE_CUSTOM_PLAN,
                        status: autoActivate ? client_1.SubscriptionStatus.ACTIVE : client_1.SubscriptionStatus.PAUSED,
                        startedAt: autoActivate ? now : existing.startedAt,
                        currentPeriodStart: autoActivate ? now : existing.currentPeriodStart,
                        currentPeriodEnd: autoActivate ? periodEnd : existing.currentPeriodEnd,
                        customPrice: price,
                        customCurrency: currency,
                        labelId,
                    },
                });
            }
            else {
                subscription = await this.prisma.subscription.create({
                    data: {
                        userId,
                        plan: ENTERPRISE_CUSTOM_PLAN,
                        status: autoActivate ? client_1.SubscriptionStatus.ACTIVE : client_1.SubscriptionStatus.PAUSED,
                        startedAt: autoActivate ? now : null,
                        currentPeriodStart: autoActivate ? now : null,
                        currentPeriodEnd: autoActivate ? periodEnd : null,
                        customPrice: price,
                        customCurrency: currency,
                        labelId,
                    },
                });
            }
            const payment = await this.paymentService.createPayment({
                userId,
                amount: price,
                description: `Enterprise Custom (${label.name}) ${period}`,
                paymentMethod: autoActivate ? 'manual' : 'xendit',
                currency,
                subscriptionId: subscription.id,
            });
            if (!autoActivate) {
                try {
                    const paymentLink = payment === null || payment === void 0 ? void 0 : payment.paymentLink;
                    await this.prisma.notification.create({
                        data: {
                            userId,
                            title: 'Pembayaran diperlukan',
                            message: paymentLink
                                ? `Langganan ENTERPRISE_CUSTOM melalui label ${label.name} telah dibuat. Silakan selesaikan pembayaran: ${paymentLink}`
                                : `Langganan ENTERPRISE_CUSTOM melalui label ${label.name} telah dibuat. Silakan selesaikan pembayaran Anda.`,
                            type: 'PAYMENT_REQUIRED',
                            relatedId: subscription.id,
                            metadata: { paymentId: payment === null || payment === void 0 ? void 0 : payment.id, paymentLink, labelId: labelId, period },
                        },
                    });
                }
                catch (e) {
                    this.logger.warn(`Failed to create payment required notification for user ${userId}: ${e === null || e === void 0 ? void 0 : e.message}`);
                }
            }
            if (autoActivate) {
                await this.prisma.subscription.update({
                    where: { id: subscription.id },
                    data: {
                        status: client_1.SubscriptionStatus.ACTIVE,
                        startedAt: now,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                    }
                });
            }
            results.push({ userId, subscriptionId: subscription.id, paymentId: payment === null || payment === void 0 ? void 0 : payment.id });
        }
        this.logger.log(`Bulk subscribe ${userIds.length} investors to ENTERPRISE_CUSTOM under label ${labelId}`);
        return { labelId, count: userIds.length, results };
    }
    calculatePeriodEnd(startDate, period) {
        const endDate = new Date(startDate);
        if (period === 'YEARLY')
            endDate.setFullYear(endDate.getFullYear() + 1);
        else
            endDate.setMonth(endDate.getMonth() + 1);
        return endDate;
    }
    async startTrialForEligibleUser(userId, role) {
        if (role === client_1.Role.ADMIN || role === client_1.Role.SUPER_ADMIN || client_1.Role.ADMIN_INVESTMENT === role || client_1.Role.ADMIN_TRADING === role) {
            this.logger.log(`Skipping trial creation for admin role: ${role}`);
            return null;
        }
        const isEligible = role === client_1.Role.INVESTOR ||
            role === client_1.Role.PROJECT_OWNER ||
            role === client_1.Role.BUYER ||
            role === client_1.Role.SELLER;
        if (!isEligible) {
            this.logger.log(`Role ${role} is not eligible for trial`);
            return null;
        }
        const existing = await this.prisma.subscription.findUnique({ where: { userId } });
        const now = new Date();
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);
        if (existing) {
            if (existing.plan !== client_1.SubscriptionPlan.TRIAL) {
                this.logger.log(`User ${userId} already has non-TRIAL plan (${existing.plan}) with status ${existing.status}; skipping trial creation`);
                return existing;
            }
            if (existing.status === client_1.SubscriptionStatus.TRIAL && existing.trialEndsAt && existing.trialEndsAt > now) {
                this.logger.log(`User ${userId} already in valid TRIAL until ${existing.trialEndsAt}`);
                return existing;
            }
            this.logger.log(`User ${userId} has an existing TRIAL that is no longer valid; not refreshing trial automatically`);
            return existing;
        }
        const created = await this.prisma.subscription.create({
            data: {
                userId,
                plan: client_1.SubscriptionPlan.TRIAL,
                status: client_1.SubscriptionStatus.TRIAL,
                startedAt: now,
                trialEndsAt,
                expiresAt: trialEndsAt,
            },
        });
        this.logger.log(`Created trial subscription for user ${userId} valid until ${trialEndsAt.toISOString()}`);
        return created;
    }
    async notifyTrialsExpiringHMinus1() {
        const roles = [client_1.Role.INVESTOR, client_1.Role.PROJECT_OWNER, client_1.Role.BUYER, client_1.Role.SELLER];
        const now = new Date();
        const start = new Date(now);
        start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        const expiring = await this.prisma.subscription.findMany({
            where: {
                status: client_1.SubscriptionStatus.TRIAL,
                trialEndsAt: { gte: start, lte: end },
                user: { role: { in: roles } },
            },
            include: { user: { select: { id: true, email: true, role: true } } },
        });
        let created = 0;
        for (const s of expiring) {
            try {
                await this.prisma.notification.create({
                    data: {
                        userId: s.userId,
                        title: 'Trial akan berakhir besok',
                        message: 'Masa trial Anda akan berakhir dalam 1 hari. Upgrade ke plan Gold untuk terus mengakses fitur premium.',
                        type: 'TRIAL_EXPIRY',
                        relatedId: s.id,
                        metadata: { trialEndsAt: s.trialEndsAt, plan: s.plan },
                    },
                });
                created++;
            }
            catch (e) {
                this.logger.warn(`Failed to create trial expiry notification for user ${s.userId}: ${e === null || e === void 0 ? void 0 : e.message}`);
            }
        }
        this.logger.log(`Trial expiry H-1 notifications created: ${created} / ${expiring.length}`);
        return { totalCandidates: expiring.length, created };
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = SubscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payment_service_1.PaymentService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map