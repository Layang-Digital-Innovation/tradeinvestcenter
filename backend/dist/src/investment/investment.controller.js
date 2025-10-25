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
exports.InvestmentController = void 0;
const common_1 = require("@nestjs/common");
const investment_service_1 = require("./investment.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const investor_project_access_decorator_1 = require("../auth/decorators/investor-project-access.decorator");
const fs_1 = require("fs");
const path_1 = require("path");
let InvestmentController = class InvestmentController {
    constructor(investmentService) {
        this.investmentService = investmentService;
    }
    async createProject(req, data) {
        return this.investmentService.createProject(req.user.id, data);
    }
    async getProjects(status) {
        return this.investmentService.getProjects({ status });
    }
    async getProjectById(id) {
        return this.investmentService.getProjectById(id);
    }
    async investInProject(req, projectId, data) {
        return this.investmentService.investInProject(req.user.id, projectId, data.amount);
    }
    async updateProjectStatus(projectId, data) {
        return this.investmentService.updateProjectStatus(projectId, data.status);
    }
    async distributeDividend(projectId, data) {
        return this.investmentService.distributeDividend(projectId, data);
    }
    async getMyProjects(req) {
        return this.investmentService.getProjectsByOwner(req.user.id);
    }
    async updateProject(req, projectId, data) {
        return this.investmentService.updateProject(projectId, req.user.id, data);
    }
    async updateBankAccount(req, projectId, data) {
        return this.investmentService.updateBankAccount(projectId, req.user.id, data);
    }
    async addFinancialReport(req, projectId, data) {
        return this.investmentService.addFinancialReport(projectId, req.user.id, data);
    }
    async getPortfolio(req) {
        return this.investmentService.getInvestorPortfolio(req.user.id);
    }
    async getInvestmentHistory(req) {
        return this.investmentService.getInvestmentHistory(req.user.id);
    }
    async getDividendHistory(req) {
        return this.investmentService.getDividendHistory(req.user.id);
    }
    async getAllProjectsForAdmin() {
        return this.investmentService.getAllProjectsForAdmin();
    }
    async getProjectStatistics() {
        return this.investmentService.getProjectStatistics();
    }
    async getAllInvestmentsForAdmin(page, limit, status) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.investmentService.getAllInvestmentsForAdmin(pageNum, limitNum, status);
    }
    async createInvestmentRequest(req, data) {
        return this.investmentService.createInvestmentRequest(req.user.id, data.projectId, data.chatId);
    }
    async getProjectDetailsForInvestor(req, projectId) {
        return this.investmentService.getProjectDetailsForInvestor(req.user.id, projectId);
    }
    async approveInvestment(req, investmentId, data) {
        return this.investmentService.approveInvestment(req.user.id, investmentId, data);
    }
    async rejectInvestment(req, investmentId, data) {
        return this.investmentService.rejectInvestment(req.user.id, investmentId, data);
    }
    async getPendingInvestments() {
        return this.investmentService.getPendingInvestments();
    }
    async getPendingProjectsCount() {
        return this.investmentService.getPendingProjectsCount();
    }
    async getMyApprovedProjects(req) {
        return this.investmentService.getInvestorApprovedProjects(req.user.id);
    }
    async getInvestmentById(req, investmentId) {
        return this.investmentService.getInvestmentById(investmentId, req.user.id, req.user.role);
    }
    async getProjectInvestments(req, projectId) {
        return this.investmentService.getProjectInvestments(projectId, req.user.id);
    }
    async previewProspectus(projectId, res) {
        const prospectusInfo = await this.investmentService.getProspectusInfo(projectId);
        if (!prospectusInfo.prospectusUrl) {
            throw new Error('Prospectus file not found');
        }
        const filename = prospectusInfo.prospectusUrl.split('/').pop();
        const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'uploads', 'prospectus', filename);
        const file = (0, fs_1.createReadStream)(filePath);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
        });
        return new common_1.StreamableFile(file);
    }
    async downloadProspectus(projectId, res) {
        const prospectusInfo = await this.investmentService.getProspectusInfo(projectId);
        if (!prospectusInfo.prospectusUrl) {
            throw new Error('Prospectus file not found');
        }
        const filename = prospectusInfo.prospectusUrl.split('/').pop();
        const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'uploads', 'prospectus', filename);
        const file = (0, fs_1.createReadStream)(filePath);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${prospectusInfo.prospectusFileName || 'prospektus.pdf'}"`,
        });
        return new common_1.StreamableFile(file);
    }
};
exports.InvestmentController = InvestmentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER'),
    (0, common_1.Post)('projects'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "createProject", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('projects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getProjectById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Post)('projects/:id/invest'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "investInProject", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT'),
    (0, common_1.Put)('projects/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "updateProjectStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER'),
    (0, common_1.Post)('projects/:id/dividends'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "distributeDividend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER'),
    (0, common_1.Get)('my-projects'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getMyProjects", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER'),
    (0, common_1.Patch)('projects/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "updateProject", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER'),
    (0, common_1.Patch)('projects/:id/bank-account'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "updateBankAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER'),
    (0, common_1.Post)('projects/:id/reports'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "addFinancialReport", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Get)('portfolio'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getPortfolio", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Get)('investment-history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getInvestmentHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Get)('dividend-history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getDividendHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Get)('admin/projects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getAllProjectsForAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Get)('admin/statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getProjectStatistics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Get)('admin/all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getAllInvestmentsForAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "createInvestmentRequest", null);
__decorate([
    (0, investor_project_access_decorator_1.RequireProjectAccess)(),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Get)('projects/:id/details'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getProjectDetailsForInvestor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "approveInvestment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "rejectInvestment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Get)('admin/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getPendingInvestments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'ADMIN_INVESTMENT', 'SUPER_ADMIN'),
    (0, common_1.Get)('admin/pending-projects-count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getPendingProjectsCount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('INVESTOR'),
    (0, common_1.Get)('my-approved-projects'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getMyApprovedProjects", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getInvestmentById", null);
__decorate([
    (0, investor_project_access_decorator_1.RequireProjectAccess)(),
    (0, roles_decorator_1.Roles)('PROJECT_OWNER', 'ADMIN', 'SUPER_ADMIN'),
    (0, common_1.Get)('projects/:id/investments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getProjectInvestments", null);
__decorate([
    (0, common_1.Get)('projects/:id/prospectus/preview'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "previewProspectus", null);
__decorate([
    (0, common_1.Get)('projects/:id/prospectus'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "downloadProspectus", null);
exports.InvestmentController = InvestmentController = __decorate([
    (0, common_1.Controller)('investment'),
    __metadata("design:paramtypes", [investment_service_1.InvestmentService])
], InvestmentController);
//# sourceMappingURL=investment.controller.js.map