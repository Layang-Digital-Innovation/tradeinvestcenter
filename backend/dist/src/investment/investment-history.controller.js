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
exports.InvestmentHistoryController = void 0;
const common_1 = require("@nestjs/common");
const investment_history_service_1 = require("./investment-history.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const investor_project_access_decorator_1 = require("../auth/decorators/investor-project-access.decorator");
const client_1 = require("@prisma/client");
let InvestmentHistoryController = class InvestmentHistoryController {
    constructor(investmentHistoryService) {
        this.investmentHistoryService = investmentHistoryService;
    }
    async getMyInvestmentHistory(req) {
        return this.investmentHistoryService.getInvestorHistory(req.user.id);
    }
    async getMyProfitSharing(req, projectId) {
        return this.investmentHistoryService.getInvestorProfitSharing(req.user.id, projectId);
    }
    async getMyInvestmentSummary(req) {
        return this.investmentHistoryService.getInvestorSummary(req.user.id);
    }
    async getProjectAnalytics(projectId, req) {
        return this.investmentHistoryService.getProjectInvestmentAnalytics(projectId, req.user.id);
    }
    async getInvestorHistory(investorId) {
        return this.investmentHistoryService.getInvestorHistory(investorId);
    }
    async getInvestorProfitSharing(investorId, projectId) {
        return this.investmentHistoryService.getInvestorProfitSharing(investorId, projectId);
    }
    async getAllInvestmentActivities(page = '1', limit = '20') {
        return this.investmentHistoryService.getAllInvestmentActivities(parseInt(page), parseInt(limit));
    }
};
exports.InvestmentHistoryController = InvestmentHistoryController;
__decorate([
    (0, common_1.Get)('my-investments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.INVESTOR),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getMyInvestmentHistory", null);
__decorate([
    (0, common_1.Get)('my-dividends'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.INVESTOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getMyProfitSharing", null);
__decorate([
    (0, common_1.Get)('my-summary'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.INVESTOR),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getMyInvestmentSummary", null);
__decorate([
    (0, common_1.Get)('project/:projectId/analytics'),
    (0, investor_project_access_decorator_1.RequireProjectAccess)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PROJECT_OWNER, client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getProjectAnalytics", null);
__decorate([
    (0, common_1.Get)('investor/:investorId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('investorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getInvestorHistory", null);
__decorate([
    (0, common_1.Get)('investor/:investorId/dividends'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('investorId')),
    __param(1, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getInvestorProfitSharing", null);
__decorate([
    (0, common_1.Get)('all-activities'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvestmentHistoryController.prototype, "getAllInvestmentActivities", null);
exports.InvestmentHistoryController = InvestmentHistoryController = __decorate([
    (0, common_1.Controller)('investment-history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [investment_history_service_1.InvestmentHistoryService])
], InvestmentHistoryController);
//# sourceMappingURL=investment-history.controller.js.map