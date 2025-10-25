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
exports.FinancialReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const financial_reports_service_1 = require("./financial-reports.service");
let FinancialReportsController = class FinancialReportsController {
    constructor(financialReportsService) {
        this.financialReportsService = financialReportsService;
    }
    async createFinancialReport(req, createReportDto) {
        console.log('Financial reports endpoint reached');
        console.log('Request user:', req.user);
        console.log('Request body:', createReportDto);
        const userId = req.user.id || req.user.sub;
        console.log('Using userId:', userId);
        try {
            const result = await this.financialReportsService.createFinancialReport(userId, createReportDto);
            console.log('Financial report created successfully:', result);
            return result;
        }
        catch (error) {
            console.error('Error creating financial report:', error);
            throw error;
        }
    }
    async getFinancialReportsByProject(req, projectId) {
        const userId = req.user.id || req.user.sub;
        return this.financialReportsService.getFinancialReportsByProject(projectId, userId);
    }
    async getMyFinancialReports(req) {
        const userId = req.user.id || req.user.sub;
        return this.financialReportsService.getMyFinancialReports(userId);
    }
    async deleteFinancialReport(req, reportId) {
        const userId = req.user.id || req.user.sub;
        return this.financialReportsService.deleteFinancialReport(reportId, userId);
    }
};
exports.FinancialReportsController = FinancialReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinancialReportsController.prototype, "createFinancialReport", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinancialReportsController.prototype, "getFinancialReportsByProject", null);
__decorate([
    (0, common_1.Get)('my-reports'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinancialReportsController.prototype, "getMyFinancialReports", null);
__decorate([
    (0, common_1.Delete)(':reportId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinancialReportsController.prototype, "deleteFinancialReport", null);
exports.FinancialReportsController = FinancialReportsController = __decorate([
    (0, common_1.Controller)('financial-reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [financial_reports_service_1.FinancialReportsService])
], FinancialReportsController);
//# sourceMappingURL=financial-reports.controller.js.map