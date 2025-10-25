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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboardData(req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        if (userRole === 'INVESTOR') {
            return this.dashboardService.getInvestorDashboard(userId);
        }
        else if (userRole === 'PROJECT_OWNER') {
            return this.dashboardService.getProjectOwnerDashboard(userId);
        }
        else if (userRole === 'SUPER_ADMIN') {
            return this.dashboardService.getAdminDashboard();
        }
        else {
            return this.dashboardService.getAdminDashboard();
        }
    }
    async getSummary(req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        if (userRole === 'INVESTOR') {
            return this.dashboardService.getInvestorSummary(userId);
        }
        else if (userRole === 'PROJECT_OWNER') {
            return this.dashboardService.getProjectOwnerSummary(userId);
        }
        else if (userRole === 'SUPER_ADMIN') {
            return this.dashboardService.getAdminSummary();
        }
        else {
            return this.dashboardService.getAdminSummary();
        }
    }
    async getStats(req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        if (userRole === 'INVESTOR') {
            return this.dashboardService.getInvestorStats(userId);
        }
        else if (userRole === 'PROJECT_OWNER') {
            return this.dashboardService.getProjectOwnerStats(userId);
        }
        else if (userRole === 'SUPER_ADMIN') {
            return this.dashboardService.getAdminStats();
        }
        else {
            return this.dashboardService.getAdminStats();
        }
    }
    async getUserAnalytics() {
        return this.dashboardService.getUserAnalytics();
    }
    async getSubscriptionAnalytics(currency) {
        const c = currency === 'IDR' || currency === 'USD' ? currency : undefined;
        return this.dashboardService.getSubscriptionAnalytics(c);
    }
    async getRevenueAnalytics() {
        return this.dashboardService.getRevenueAnalytics();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('analytics/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('analytics/subscriptions'),
    __param(0, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSubscriptionAnalytics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('analytics/revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRevenueAnalytics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map