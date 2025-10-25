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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const subscription_service_1 = require("./subscription.service");
const payment_service_1 = require("./payment.service");
const paypal_subscription_service_1 = require("./paypal-subscription.service");
const payment_gateway_service_1 = require("./payment-gateway.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService, paymentService, paypalSubscriptionService, paymentGateway, configService) {
        this.subscriptionService = subscriptionService;
        this.paymentService = paymentService;
        this.paypalSubscriptionService = paypalSubscriptionService;
        this.paymentGateway = paymentGateway;
        this.configService = configService;
    }
    async getSubscriptionPlans() {
        return this.subscriptionService.getSubscriptionPlans();
    }
    async getAllSubscriptions() {
        return this.subscriptionService.getAllSubscriptions();
    }
    async getUserSubscription(req) {
        return this.subscriptionService.getUserSubscription(req.user.id);
    }
    async createSubscription(req, data) {
        return this.subscriptionService.createSubscription(req.user.id, data.planId, data.paymentMethod);
    }
    async activateSubscription(id) {
        return this.subscriptionService.activateSubscription(id);
    }
    async executePaypalPayment(paymentId, payerId) {
        return this.paymentService.executePaypalPayment(paymentId, payerId);
    }
    async cancelPayment() {
        return { success: false, message: 'Pembayaran dibatalkan' };
    }
    async createBillingPlan(data) {
        const currency = (data.currency || 'USD').toUpperCase();
        const provider = (data.provider || (currency === 'USD' ? 'PAYPAL' : 'XENDIT')).toUpperCase();
        if (currency === 'USD' && provider === 'PAYPAL') {
            return this.paypalSubscriptionService.createBillingPlan(data.plan, data.price, data.period, data.name);
        }
        return this.subscriptionService.createLocalBillingPlan({
            plan: data.plan,
            price: data.price,
            period: data.period,
            name: data.name,
            currency: currency,
            provider: provider,
        });
    }
    async updateBillingPlan(id, body) {
        return this.subscriptionService.updateBillingPlan(id, body);
    }
    async deleteBillingPlan(id) {
        return this.subscriptionService.deleteBillingPlan(id);
    }
    async createBillingAgreement(req, data) {
        return this.paypalSubscriptionService.createBillingAgreement(req.user.id, data.planId, data.billingPlanId);
    }
    async executeBillingAgreement(token, baToken, res) {
        const frontUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const tok = token || baToken;
        if (!tok) {
            return res.redirect(`${frontUrl}/dashboard/subscription?status=error&reason=missing_token`);
        }
        try {
            const result = await this.paypalSubscriptionService.executeBillingAgreement(tok);
            if (result === null || result === void 0 ? void 0 : result.success) {
                return res.redirect(`${frontUrl}/dashboard/subscription?status=success`);
            }
            return res.redirect(`${frontUrl}/dashboard/subscription?status=error&reason=unknown`);
        }
        catch (e) {
            const reason = encodeURIComponent((e === null || e === void 0 ? void 0 : e.message) || 'internal_error');
            return res.redirect(`${frontUrl}/dashboard/subscription?status=error&reason=${reason}`);
        }
    }
    async cancelSubscription(id, req) {
        return this.subscriptionService.cancelSubscription(id, req.user.id);
    }
    async verifyPayment(data) {
        const payment = await this.paymentService.verifyPayment(data.paymentId, data.transactionId);
        if (payment.status === client_1.PaymentStatus.PAID) {
            const subscription = await this.subscriptionService['prisma'].subscription.findFirst({
                where: { userId: payment.userId },
            });
            if (subscription) {
                await this.subscriptionService.activateSubscription(subscription.id);
            }
        }
        return { success: true };
    }
    async getPayment(id) {
        return this.paymentService.getPaymentById(id);
    }
    async getUserPayments(req) {
        return this.paymentService.getUserPayments(req.user.id);
    }
    async unifiedCheckout(req, body) {
        return this.paymentGateway.checkout(Object.assign({ userId: req.user.id }, body));
    }
    async startTrial(req) {
        return this.subscriptionService.startTrialForEligibleUser(req.user.id, req.user.role);
    }
    async notifyExpiringTrials() {
        return this.subscriptionService.notifyTrialsExpiringHMinus1();
    }
    async notifyEnterpriseExpiring() {
        return this.subscriptionService.notifyEnterpriseCustomExpiringHMinus1();
    }
    async checkAccess(req, tier) {
        const hasAccess = await this.subscriptionService.checkSubscriptionAccess(req.user.id, tier);
        return { hasAccess };
    }
    async getEnterpriseLabels() {
        return this.subscriptionService.getEnterpriseLabels();
    }
    async createEnterpriseLabel(body) {
        return this.subscriptionService.createEnterpriseLabel(body);
    }
    async updateEnterpriseLabel(id, body) {
        return this.subscriptionService.updateEnterpriseLabel(id, body);
    }
    async deleteEnterpriseLabel(id) {
        return this.subscriptionService.deleteEnterpriseLabel(id);
    }
    async bulkCreateInvestors(body) {
        return this.subscriptionService.bulkCreateInvestorsForLabel(body);
    }
    async bulkSubscribeInvestors(body) {
        return this.subscriptionService.bulkSubscribeInvestorsForLabel(body);
    }
    async createOrgInvoice(req, body) {
        var _a;
        return this.subscriptionService.createOrgInvoiceForLabel({
            adminUserId: req.user.id,
            labelId: body.labelId,
            userIds: body.userIds,
            pricePerUser: ((_a = body.pricePerUser) !== null && _a !== void 0 ? _a : 0),
            totalAmount: body.totalAmount,
            currency: body.currency,
            period: body.period,
            provider: body.provider,
            description: body.description,
            invoiceNumber: body.invoiceNumber,
            referenceNumber: body.referenceNumber,
            bankName: body.bankName,
            paidBy: body.paidBy,
            notes: body.notes,
            awaitingApproval: body.awaitingApproval,
            additionalSeats: body.additionalSeats,
        });
    }
    async renewOrgInvoice(req, body) {
        return this.subscriptionService.createOrgInvoiceRenewalFromPayment({
            adminUserId: req.user.id,
            previousPaymentId: body.previousPaymentId,
            period: body.period,
            currency: body.currency,
            totalAmount: body.totalAmount,
            pricePerUser: body.pricePerUser,
            provider: body.provider,
            description: body.description,
            invoiceNumber: body.invoiceNumber,
            referenceNumber: body.referenceNumber,
            bankName: body.bankName,
            paidBy: body.paidBy,
            notes: body.notes,
            awaitingApproval: body.awaitingApproval,
        });
    }
    async xenditWebhook(payload) {
        const event = (payload === null || payload === void 0 ? void 0 : payload.event) || (payload === null || payload === void 0 ? void 0 : payload.event_type) || (payload === null || payload === void 0 ? void 0 : payload.type);
        const data = (payload === null || payload === void 0 ? void 0 : payload.data) || payload;
        await this.paymentService.handleXenditWebhook(event, data);
        if ((event === 'invoice.paid') && (data === null || data === void 0 ? void 0 : data.id)) {
            const payment = await this.subscriptionService['prisma'].payment.findFirst({ where: { externalId: data.id } });
            if (payment && payment.status === 'PAID') {
                const meta = payment.metadata || {};
                if (meta.mode === 'ORG_INVOICE' && Array.isArray(meta.userIds) && meta.labelId) {
                    await this.subscriptionService.activateBulkFromOrgInvoice({
                        labelId: meta.labelId,
                        userIds: meta.userIds,
                        pricePerUser: meta.pricePerUser || 0,
                        currency: meta.currency || 'IDR',
                        period: meta.period || 'MONTHLY',
                    });
                }
            }
        }
        return { success: true };
    }
    async approveManualOrg(body) {
        return this.subscriptionService.approveManualOrgPayment(body.paymentId);
    }
    async failManualOrg(body) {
        return this.subscriptionService.failManualOrgPayment(body);
    }
    async listAdminPayments(labelId, status, provider, mode, limit = '50') {
        const take = Math.min(parseInt(limit || '50', 10) || 50, 200);
        const where = {};
        if (labelId)
            where.labelId = labelId;
        if (status) {
            if (status === 'AWAITING_APPROVAL') {
                where.metadata = { path: ['awaitingApproval'], equals: true };
            }
            else {
                where.status = status;
            }
        }
        if (provider) {
            const p = provider.toUpperCase();
            if (p === 'XENDIT' || p === 'PAYPAL') {
                where.provider = p;
            }
        }
        if (mode)
            where.metadata = { path: ['mode'], equals: mode };
        if (!mode) {
            where.AND = [
                { metadata: { path: ['mode'], equals: 'ORG_INVOICE' } },
            ];
        }
        const payments = await this.subscriptionService['prisma'].payment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take,
            select: {
                id: true,
                userId: true,
                labelId: true,
                label: { select: { id: true, name: true } },
                amount: true,
                currency: true,
                provider: true,
                status: true,
                invoiceNumber: true,
                description: true,
                createdAt: true,
                paidAt: true,
                metadata: true,
            }
        });
        return { items: payments };
    }
    async getInvoiceHtml(id, res) {
        const { html, filename } = await this.subscriptionService.buildInvoiceHtml(id);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.send(html);
    }
    async getInvoicePdf(id, res) {
        await this.subscriptionService.streamInvoicePdf(res, id);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getSubscriptionPlans", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getAllSubscriptions", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getUserSubscription", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "activateSubscription", null);
__decorate([
    (0, common_1.Get)('payment/paypal/execute'),
    __param(0, (0, common_1.Query)('paymentId')),
    __param(1, (0, common_1.Query)('PayerID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "executePaypalPayment", null);
__decorate([
    (0, common_1.Get)('payment/cancel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelPayment", null);
__decorate([
    (0, common_1.Post)('billing-plan/create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createBillingPlan", null);
__decorate([
    (0, common_1.Put)('billing-plan/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateBillingPlan", null);
__decorate([
    (0, common_1.Delete)('billing-plan/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "deleteBillingPlan", null);
__decorate([
    (0, common_1.Post)('billing-agreement/create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createBillingAgreement", null);
__decorate([
    (0, common_1.Get)('billing-agreement/execute'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Query)('ba_token')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "executeBillingAgreement", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)('payment/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('payment/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getUserPayments", null);
__decorate([
    (0, common_1.Post)('payment/checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "unifiedCheckout", null);
__decorate([
    (0, common_1.Post)('trial/start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "startTrial", null);
__decorate([
    (0, common_1.Post)('trial/notify-expiring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "notifyExpiringTrials", null);
__decorate([
    (0, common_1.Post)('enterprise/notify-expiring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "notifyEnterpriseExpiring", null);
__decorate([
    (0, common_1.Get)('check-access/:tier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('tier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "checkAccess", null);
__decorate([
    (0, common_1.Get)('enterprise/labels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getEnterpriseLabels", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createEnterpriseLabel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Put)('enterprise/labels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateEnterpriseLabel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Delete)('enterprise/labels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "deleteEnterpriseLabel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label/investors/bulk-create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "bulkCreateInvestors", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label/investors/bulk-subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "bulkSubscribeInvestors", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label/org-invoice'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createOrgInvoice", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label/org-invoice/renew'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "renewOrgInvoice", null);
__decorate([
    (0, common_1.Post)('payment/xendit/webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "xenditWebhook", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label/manual/approve'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "approveManualOrg", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('enterprise/label/manual/fail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "failManualOrg", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('payments/admin'),
    __param(0, (0, common_1.Query)('labelId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('provider')),
    __param(3, (0, common_1.Query)('mode')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "listAdminPayments", null);
__decorate([
    (0, common_1.Get)('payment/:id/invoice/html'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getInvoiceHtml", null);
__decorate([
    (0, common_1.Get)('payment/:id/invoice/pdf'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getInvoicePdf", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, common_1.Controller)('subscription'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        payment_service_1.PaymentService,
        paypal_subscription_service_1.PaypalSubscriptionService,
        payment_gateway_service_1.PaymentGatewayService,
        config_1.ConfigService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map