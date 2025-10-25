"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentModule = void 0;
const common_1 = require("@nestjs/common");
const investment_controller_1 = require("./investment.controller");
const investment_service_1 = require("./investment.service");
const investment_history_controller_1 = require("./investment-history.controller");
const investment_history_service_1 = require("./investment-history.service");
const prisma_module_1 = require("../prisma/prisma.module");
const notification_module_1 = require("../notification/notification.module");
let InvestmentModule = class InvestmentModule {
};
exports.InvestmentModule = InvestmentModule;
exports.InvestmentModule = InvestmentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [investment_controller_1.InvestmentController, investment_history_controller_1.InvestmentHistoryController],
        providers: [investment_service_1.InvestmentService, investment_history_service_1.InvestmentHistoryService],
        exports: [investment_service_1.InvestmentService, investment_history_service_1.InvestmentHistoryService],
    })
], InvestmentModule);
//# sourceMappingURL=investment.module.js.map