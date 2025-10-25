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
var PaymentGatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const xendit_subscription_service_1 = require("./xendit-subscription.service");
const paypal_subscription_service_1 = require("./paypal-subscription.service");
const payment_service_1 = require("./payment.service");
let PaymentGatewayService = PaymentGatewayService_1 = class PaymentGatewayService {
    constructor(prisma, xenditSubscription, paypalSubscription, paymentService) {
        this.prisma = prisma;
        this.xenditSubscription = xenditSubscription;
        this.paypalSubscription = paypalSubscription;
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(PaymentGatewayService_1.name);
    }
    async checkout(input) {
        const currency = input.currency || 'IDR';
        const preferPaypal = input.provider === 'paypal' || currency === 'USD';
        if (input.type === 'subscription') {
            if (input.plan === 'ENTERPRISE_CUSTOM') {
                if (!input.price || input.price <= 0) {
                    throw new common_1.BadRequestException('price is required for ENTERPRISE_CUSTOM');
                }
                if (preferPaypal) {
                    if (!input.billingPlanId) {
                        throw new common_1.BadRequestException('billingPlanId is required for PayPal subscription');
                    }
                    return this.paypalSubscription.createBillingAgreement(input.userId, input.plan, input.billingPlanId);
                }
                return this.xenditSubscription.createSubscriptionPlan({
                    userId: input.userId,
                    plan: input.plan,
                    price: input.price,
                    currency,
                });
            }
            if (!input.plan) {
                throw new common_1.BadRequestException('plan is required for subscription');
            }
            if (preferPaypal) {
                if (!input.billingPlanId) {
                    throw new common_1.BadRequestException('billingPlanId is required for PayPal subscription');
                }
                return this.paypalSubscription.createBillingAgreement(input.userId, input.plan, input.billingPlanId);
            }
            if (!input.price || input.price <= 0) {
                throw new common_1.BadRequestException('price is required for subscription checkout');
            }
            return this.xenditSubscription.createSubscriptionPlan({
                userId: input.userId,
                plan: input.plan,
                price: input.price,
                currency,
            });
        }
        if (!input.price || input.price <= 0) {
            throw new common_1.BadRequestException('price is required for one_time checkout');
        }
        const method = preferPaypal ? 'paypal' : 'xendit';
        return this.paymentService.createPayment({
            userId: input.userId,
            amount: input.price,
            description: input.description || 'One-time payment',
            paymentMethod: method,
            currency,
        });
    }
};
exports.PaymentGatewayService = PaymentGatewayService;
exports.PaymentGatewayService = PaymentGatewayService = PaymentGatewayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        xendit_subscription_service_1.XenditSubscriptionService,
        paypal_subscription_service_1.PaypalSubscriptionService,
        payment_service_1.PaymentService])
], PaymentGatewayService);
//# sourceMappingURL=payment-gateway.service.js.map