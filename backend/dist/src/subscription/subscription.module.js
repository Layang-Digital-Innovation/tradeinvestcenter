"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const settings_module_1 = require("../settings/settings.module");
const subscription_controller_1 = require("./subscription.controller");
const subscription_service_1 = require("./subscription.service");
const payment_service_1 = require("./payment.service");
const paypal_config_1 = require("./paypal.config");
const paypal_subscription_service_1 = require("./paypal-subscription.service");
const xendit_subscription_service_1 = require("./xendit-subscription.service");
const payment_gateway_service_1 = require("./payment-gateway.service");
const subscription_scheduler_1 = require("./subscription.scheduler");
let SubscriptionModule = class SubscriptionModule {
};
exports.SubscriptionModule = SubscriptionModule;
exports.SubscriptionModule = SubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [settings_module_1.SettingsModule],
        controllers: [subscription_controller_1.SubscriptionController],
        providers: [subscription_service_1.SubscriptionService, payment_service_1.PaymentService, paypal_config_1.PaypalConfigService, paypal_subscription_service_1.PaypalSubscriptionService, xendit_subscription_service_1.XenditSubscriptionService, payment_gateway_service_1.PaymentGatewayService, subscription_scheduler_1.SubscriptionScheduler],
        exports: [subscription_service_1.SubscriptionService, payment_service_1.PaymentService, paypal_subscription_service_1.PaypalSubscriptionService, xendit_subscription_service_1.XenditSubscriptionService, payment_gateway_service_1.PaymentGatewayService],
    })
], SubscriptionModule);
//# sourceMappingURL=subscription.module.js.map