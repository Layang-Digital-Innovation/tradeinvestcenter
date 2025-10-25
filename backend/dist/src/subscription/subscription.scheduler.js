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
var SubscriptionScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const subscription_service_1 = require("./subscription.service");
let SubscriptionScheduler = SubscriptionScheduler_1 = class SubscriptionScheduler {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
        this.logger = new common_1.Logger(SubscriptionScheduler_1.name);
    }
    async handleTrialExpiryHMinus1Notifications() {
        try {
            this.logger.log('Running daily job: notifyTrialsExpiringHMinus1');
            const result = await this.subscriptionService.notifyTrialsExpiringHMinus1();
            this.logger.log(`Trial expiry notifications job result: ${JSON.stringify(result)}`);
        }
        catch (e) {
            this.logger.error(`notifyTrialsExpiringHMinus1 failed: ${e === null || e === void 0 ? void 0 : e.message}`, e === null || e === void 0 ? void 0 : e.stack);
        }
    }
    async handleAutoExpirePastDue() {
        try {
            this.logger.log('Running daily job: expirePastDueSubscriptions');
            const result = await this.subscriptionService.expirePastDueSubscriptions();
            this.logger.log(`Auto-expire job result: ${JSON.stringify(result)}`);
        }
        catch (e) {
            this.logger.error(`expirePastDueSubscriptions failed: ${e === null || e === void 0 ? void 0 : e.message}`, e === null || e === void 0 ? void 0 : e.stack);
        }
    }
    async handleEnterpriseExpiryHMinus1Notifications() {
        try {
            this.logger.log('Running daily job: notifyEnterpriseCustomExpiringHMinus1');
            const result = await this.subscriptionService.notifyEnterpriseCustomExpiringHMinus1();
            this.logger.log(`Enterprise expiry notifications job result: ${JSON.stringify(result)}`);
        }
        catch (e) {
            this.logger.error(`notifyEnterpriseCustomExpiringHMinus1 failed: ${e === null || e === void 0 ? void 0 : e.message}`, e === null || e === void 0 ? void 0 : e.stack);
        }
    }
};
exports.SubscriptionScheduler = SubscriptionScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionScheduler.prototype, "handleTrialExpiryHMinus1Notifications", null);
__decorate([
    (0, schedule_1.Cron)('10 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionScheduler.prototype, "handleAutoExpirePastDue", null);
__decorate([
    (0, schedule_1.Cron)('15 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionScheduler.prototype, "handleEnterpriseExpiryHMinus1Notifications", null);
exports.SubscriptionScheduler = SubscriptionScheduler = SubscriptionScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionScheduler);
//# sourceMappingURL=subscription.scheduler.js.map