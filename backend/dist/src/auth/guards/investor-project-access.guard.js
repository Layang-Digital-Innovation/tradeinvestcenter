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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorProjectAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InvestorProjectAccessGuard = class InvestorProjectAccessGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.params.id || request.params.projectId;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        if (user.role === client_1.Role.ADMIN || user.role === client_1.Role.SUPER_ADMIN) {
            return true;
        }
        if (user.role === client_1.Role.PROJECT_OWNER) {
            const project = await this.prisma.project.findUnique({
                where: { id: projectId },
                select: {
                    id: true,
                    ownerId: true
                }
            });
            if (project && project.ownerId === user.id) {
                return true;
            }
        }
        if (user.role === client_1.Role.INVESTOR) {
            const investment = await this.prisma.investment.findFirst({
                where: {
                    investorId: user.id,
                    projectId: projectId,
                    status: {
                        in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                    },
                },
            });
            if (investment) {
                return true;
            }
        }
        throw new common_1.ForbiddenException('You do not have access to this project');
    }
};
exports.InvestorProjectAccessGuard = InvestorProjectAccessGuard;
exports.InvestorProjectAccessGuard = InvestorProjectAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvestorProjectAccessGuard);
//# sourceMappingURL=investor-project-access.guard.js.map