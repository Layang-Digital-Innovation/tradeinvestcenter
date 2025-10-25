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
exports.InvestmentHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InvestmentHistoryService = class InvestmentHistoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInvestorHistory(investorId) {
        const investments = await this.prisma.investment.findMany({
            where: { investorId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                dividendDistributions: {
                    include: {
                        dividend: {
                            select: {
                                id: true,
                                amount: true,
                                date: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return investments.map(investment => (Object.assign(Object.assign({}, investment), { totalDividendsReceived: investment.dividendDistributions
                .filter(dist => dist.status === client_1.DividendStatus.PAID)
                .reduce((sum, dist) => sum + dist.amount, 0), pendingDividends: investment.dividendDistributions
                .filter(dist => dist.status === client_1.DividendStatus.PENDING)
                .reduce((sum, dist) => sum + dist.amount, 0) })));
    }
    async getInvestorProfitSharing(investorId, projectId) {
        const where = { investorId };
        if (projectId) {
            where.investment = { projectId };
        }
        const dividendDistributions = await this.prisma.dividendDistribution.findMany({
            where,
            include: {
                dividend: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                            },
                        },
                    },
                },
                investment: {
                    select: {
                        id: true,
                        amount: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return dividendDistributions;
    }
    async getInvestorSummary(investorId) {
        const investments = await this.prisma.investment.findMany({
            where: {
                investorId,
                status: {
                    in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                },
            },
            include: {
                dividendDistributions: true,
            },
        });
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalDividendsReceived = investments
            .flatMap(inv => inv.dividendDistributions)
            .filter(dist => dist.status === client_1.DividendStatus.PAID)
            .reduce((sum, dist) => sum + dist.amount, 0);
        const pendingDividends = investments
            .flatMap(inv => inv.dividendDistributions)
            .filter(dist => dist.status === client_1.DividendStatus.PENDING)
            .reduce((sum, dist) => sum + dist.amount, 0);
        const activeInvestments = investments.filter(inv => inv.status === client_1.InvestmentStatus.APPROVED || inv.status === client_1.InvestmentStatus.ACTIVE).length;
        const totalProjects = investments.length;
        return {
            totalInvested,
            totalDividendsReceived,
            pendingDividends,
            activeInvestments,
            totalProjects,
            roi: totalInvested > 0 ? (totalDividendsReceived / totalInvested) * 100 : 0,
        };
    }
    async getProjectInvestmentAnalytics(projectId, ownerId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                title: true,
                targetAmount: true,
                currentAmount: true,
                status: true,
                ownerId: true,
                investments: {
                    where: {
                        status: {
                            in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                        },
                    },
                    select: {
                        id: true,
                        amount: true,
                        createdAt: true,
                        investor: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                        dividendDistributions: {
                            select: {
                                id: true,
                                amount: true,
                                status: true,
                            },
                        },
                    },
                },
                dividends: {
                    select: {
                        id: true,
                        distributions: {
                            select: {
                                id: true,
                                amount: true,
                                status: true,
                                investor: {
                                    select: {
                                        id: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!project || project.ownerId !== ownerId) {
            throw new Error('Project not found or access denied');
        }
        const totalInvestments = project.investments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalInvestors = project.investments.length;
        const totalDividendsDistributed = project.dividends
            .flatMap(dividend => dividend.distributions)
            .filter(dist => dist.status === client_1.DividendStatus.PAID)
            .reduce((sum, dist) => sum + dist.amount, 0);
        const investorBreakdown = project.investments.map(investment => ({
            investor: investment.investor,
            investmentAmount: investment.amount,
            investmentDate: investment.createdAt,
            dividendsReceived: investment.dividendDistributions
                .filter(dist => dist.status === client_1.DividendStatus.PAID)
                .reduce((sum, dist) => sum + dist.amount, 0),
            pendingDividends: investment.dividendDistributions
                .filter(dist => dist.status === client_1.DividendStatus.PENDING)
                .reduce((sum, dist) => sum + dist.amount, 0),
        }));
        return {
            project: {
                id: project.id,
                title: project.title,
                targetAmount: project.targetAmount,
                currentAmount: project.currentAmount,
                status: project.status,
            },
            analytics: {
                totalInvestments,
                totalInvestors,
                totalDividendsDistributed,
                fundingProgress: project.targetAmount && project.targetAmount > 0 ? (totalInvestments / project.targetAmount) * 100 : 0,
            },
            investorBreakdown,
            dividendHistory: project.dividends,
        };
    }
    async getAllInvestmentActivities(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [investments, total] = await Promise.all([
            this.prisma.investment.findMany({
                skip,
                take: limit,
                include: {
                    investor: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    project: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            owner: {
                                select: {
                                    id: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.investment.count(),
        ]);
        return {
            investments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.InvestmentHistoryService = InvestmentHistoryService;
exports.InvestmentHistoryService = InvestmentHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvestmentHistoryService);
//# sourceMappingURL=investment-history.service.js.map