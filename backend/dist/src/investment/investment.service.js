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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const client_1 = require("@prisma/client");
let InvestmentService = class InvestmentService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async createProject(ownerId, data) {
        let deadlineDate = undefined;
        if (data.deadline) {
            if (typeof data.deadline === 'string') {
                deadlineDate = new Date(data.deadline + 'T23:59:59.999Z');
            }
            else {
                deadlineDate = data.deadline;
            }
        }
        const project = await this.prisma.project.create({
            data: {
                title: data.title,
                description: data.description,
                ownerId,
                targetAmount: data.targetAmount,
                deadline: deadlineDate,
                accountNumber: data.bankAccount,
                bankName: data.bankName,
                accountHolder: data.accountHolder,
                profitSharingPercentage: data.profitSharingPercentage,
                profitSharingPercentageAfterBEP: data.profitSharingPercentageAfterBEP,
                minInvestment: data.minInvestment,
                prospectusUrl: data.prospectusUrl,
                prospectusFileName: data.prospectusFileName,
            },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                role: {
                    in: [client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN]
                }
            }
        });
        for (const admin of admins) {
            await this.notificationService.createNotification({
                userId: admin.id,
                type: 'NEW_PROJECT',
                title: 'Proyek Baru Dibuat',
                message: `Proyek baru "${data.title}" telah dibuat dan menunggu persetujuan`,
                relatedId: project.id,
                metadata: {
                    projectId: project.id,
                    projectTitle: data.title,
                    ownerId: ownerId
                },
            });
        }
        return project;
    }
    async getProjects(filters) {
        const projects = await this.prisma.project.findMany({
            where: filters,
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                investments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                    },
                },
            },
        });
        return projects.map(project => {
            const totalInvestment = project.investments
                .filter(inv => inv.status === client_1.InvestmentStatus.APPROVED || inv.status === client_1.InvestmentStatus.ACTIVE)
                .reduce((sum, inv) => sum + inv.amount, 0);
            return Object.assign(Object.assign({}, project), { totalInvestment });
        });
    }
    async getProjectById(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                investments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        createdAt: true,
                        investor: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                reports: true,
                dividends: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const totalInvestment = project.investments
            .filter(inv => inv.status === client_1.InvestmentStatus.APPROVED || inv.status === client_1.InvestmentStatus.ACTIVE)
            .reduce((sum, inv) => sum + inv.amount, 0);
        return Object.assign(Object.assign({}, project), { totalInvestment });
    }
    async investInProject(investorId, projectId, amount) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                title: true,
                ownerId: true,
                status: true,
                targetAmount: true,
                deadline: true,
                minInvestment: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.status !== client_1.ProjectStatus.ONGOING && project.status !== client_1.ProjectStatus.APPROVED) {
            throw new common_1.BadRequestException('Project is not open for investment');
        }
        if (project.deadline && new Date(project.deadline) < new Date()) {
            throw new common_1.BadRequestException('Project deadline has passed');
        }
        if (amount <= 0) {
            throw new common_1.BadRequestException('Investment amount must be greater than 0');
        }
        if (project.minInvestment && amount < project.minInvestment) {
            throw new common_1.BadRequestException(`Minimum investment is ${project.minInvestment}`);
        }
        let totalApprovedActive = 0;
        if (project.targetAmount) {
            const aggregate = await this.prisma.investment.aggregate({
                where: { projectId, status: { in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE] } },
                _sum: { amount: true },
            });
            totalApprovedActive = aggregate._sum.amount || 0;
            if (totalApprovedActive >= project.targetAmount) {
                throw new common_1.BadRequestException('Project is already fully funded');
            }
            const remaining = project.targetAmount - totalApprovedActive;
            if (amount > remaining) {
                throw new common_1.BadRequestException(`Investment exceeds remaining target (${remaining})`);
            }
        }
        const investment = await this.prisma.investment.create({
            data: {
                amount,
                investorId,
                projectId,
                status: client_1.InvestmentStatus.PENDING,
            },
            include: {
                project: {
                    select: {
                        title: true,
                        owner: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                investor: {
                    select: {
                        email: true,
                    },
                },
            },
        });
        await this.notificationService.createNotification({
            userId: project.ownerId,
            type: 'INVESTMENT_REQUEST',
            title: 'New Investment Request',
            message: `New investment of ${amount} received for project ${project.title}`,
            metadata: {
                investmentId: investment.id,
                projectId,
                amount,
            },
        });
        return investment;
    }
    async updateProjectStatus(projectId, status) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.prisma.project.update({
            where: { id: projectId },
            data: { status },
        });
    }
    async addProjectReport(projectId, data) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.prisma.report.create({
            data: {
                type: data.type,
                fileUrl: data.fileUrl,
                projectId,
            },
        });
    }
    async distributeDividend(projectId, data) {
        var _a, _b;
        if (!data.amount || data.amount <= 0) {
            throw new common_1.BadRequestException('Dividend amount must be greater than 0');
        }
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                title: true,
                profitSharingPercentage: true,
                profitSharingPercentageAfterBEP: true,
                investments: {
                    where: { status: { in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE] } },
                    select: { id: true, investorId: true, amount: true },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const totalInvestment = project.investments.reduce((sum, inv) => sum + inv.amount, 0);
        if (totalInvestment <= 0) {
            throw new common_1.BadRequestException('No approved/active investments to distribute dividends');
        }
        const investorPortionPercent = (_b = (_a = (data.afterBEP ? project.profitSharingPercentageAfterBEP : project.profitSharingPercentage)) !== null && _a !== void 0 ? _a : project.profitSharingPercentage) !== null && _b !== void 0 ? _b : 0;
        if (!investorPortionPercent || investorPortionPercent <= 0) {
            throw new common_1.BadRequestException('Project profit sharing percentage is not configured');
        }
        const dividend = await this.prisma.dividend.create({
            data: {
                amount: data.amount,
                date: data.date,
                projectId,
            },
        });
        const distributions = project.investments.map(inv => {
            const investorShare = inv.amount / totalInvestment;
            const distributionPercentage = investorShare * investorPortionPercent;
            const distributionAmount = data.amount * (distributionPercentage / 100);
            return {
                amount: distributionAmount,
                percentage: distributionPercentage,
                dividendId: dividend.id,
                investorId: inv.investorId,
                investmentId: inv.id,
            };
        });
        if (distributions.length > 0) {
            await this.prisma.dividendDistribution.createMany({ data: distributions });
        }
        try {
            for (const inv of project.investments) {
                await this.notificationService.createNotification({
                    userId: inv.investorId,
                    type: 'DIVIDEND_DISTRIBUTED',
                    title: `Dividend distributed for ${project.title}`,
                    message: `A dividend has been distributed. Check your portfolio for details.`,
                    metadata: { projectId, dividendId: dividend.id },
                });
            }
        }
        catch (err) {
            console.error('Failed to send dividend notifications:', err);
        }
        return Object.assign(Object.assign({}, dividend), { distributionsCreated: distributions.length });
    }
    async getProjectsByOwner(ownerId) {
        const projects = await this.prisma.project.findMany({
            where: { ownerId },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                ownerId: true,
                targetAmount: true,
                currentAmount: true,
                profitSharingPercentage: true,
                profitSharingPercentageAfterBEP: true,
                minInvestment: true,
                prospectusUrl: true,
                prospectusFileName: true,
                deadline: true,
                bankName: true,
                accountNumber: true,
                accountHolder: true,
                createdAt: true,
                updatedAt: true,
                investments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        createdAt: true,
                        investor: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                reports: true,
                dividends: true,
                _count: {
                    select: {
                        investments: true,
                    },
                },
            },
        });
        return projects.map(project => {
            const totalInvestment = project.investments
                .filter(inv => inv.status === client_1.InvestmentStatus.APPROVED || inv.status === client_1.InvestmentStatus.ACTIVE)
                .reduce((sum, inv) => sum + inv.amount, 0);
            return Object.assign(Object.assign({}, project), { totalInvestment });
        });
    }
    async updateProject(projectId, ownerId, data) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only update your own projects');
        }
        const currentFinancialDocs = project.financialDocs || {};
        let deadlineToSave = undefined;
        if (data.deadline !== undefined && data.deadline !== null) {
            if (typeof data.deadline === 'string') {
                const raw = data.deadline.trim();
                if (raw) {
                    const iso = raw.includes('T') ? raw : `${raw}T23:59:59.999Z`;
                    const parsed = new Date(iso);
                    if (!isNaN(parsed.getTime())) {
                        deadlineToSave = parsed;
                    }
                }
            }
            else if (data.deadline instanceof Date) {
                if (!isNaN(data.deadline.getTime())) {
                    deadlineToSave = data.deadline;
                }
            }
        }
        return this.prisma.project.update({
            where: { id: projectId },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.title && { title: data.title })), (data.description && { description: data.description })), (data.targetAmount !== undefined && { targetAmount: data.targetAmount })), (deadlineToSave !== undefined && { deadline: deadlineToSave })), (data.minInvestment !== undefined && { minInvestment: data.minInvestment })), (data.profitSharingPercentage !== undefined && { profitSharingPercentage: data.profitSharingPercentage })), (data.profitSharingPercentageAfterBEP !== undefined && { profitSharingPercentageAfterBEP: data.profitSharingPercentageAfterBEP })), (data.prospectusUrl !== undefined && { prospectusUrl: data.prospectusUrl })), (data.prospectusFileName !== undefined && { prospectusFileName: data.prospectusFileName })), (data.bankName !== undefined && { bankName: data.bankName })), (data.bankAccount !== undefined && { accountNumber: data.bankAccount })), (data.accountHolder !== undefined && { accountHolder: data.accountHolder })), { financialDocs: Object.assign(Object.assign({}, currentFinancialDocs), (data.progress !== undefined && { progress: data.progress })) }),
        });
    }
    async updateBankAccount(projectId, ownerId, data) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only update your own projects');
        }
        const currentFinancialDocs = project.financialDocs || {};
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                financialDocs: Object.assign(Object.assign({}, currentFinancialDocs), { bankAccount: data.bankAccount, bankName: data.bankName, accountHolder: data.accountHolder }),
            },
        });
    }
    async addFinancialReport(projectId, ownerId, data) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only add reports to your own projects');
        }
        return this.prisma.report.create({
            data: {
                type: data.type,
                fileUrl: data.fileUrl,
                projectId,
            },
        });
    }
    async getInvestorPortfolio(investorId) {
        const investments = await this.prisma.investment.findMany({
            where: {
                investorId,
                status: {
                    in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                },
            },
            include: {
                project: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                        dividends: true,
                        investments: {
                            where: {
                                status: {
                                    in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                                },
                            },
                            select: {
                                amount: true,
                            },
                        },
                        _count: {
                            select: {
                                investments: true,
                            },
                        },
                    },
                },
                dividendDistributions: {
                    where: {
                        status: 'PAID',
                    },
                },
            },
        });
        const portfolio = investments.map(investment => {
            var _a;
            const totalProjectInvestment = ((_a = investment.project.investments) === null || _a === void 0 ? void 0 : _a.reduce((sum, inv) => sum + inv.amount, 0)) || 0;
            const investorShare = totalProjectInvestment > 0 ? investment.amount / totalProjectInvestment : 0;
            const totalDividends = investment.project.dividends.reduce((sum, div) => sum + (div.amount * investorShare), 0);
            const dividendsReceived = investment.dividendDistributions.reduce((sum, dist) => sum + dist.amount, 0);
            return Object.assign(Object.assign({}, investment), { investorShare: investorShare * 100, totalDividends,
                dividendsReceived, project: Object.assign(Object.assign({}, investment.project), { totalInvestment: totalProjectInvestment }) });
        });
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalDividendsReceived = portfolio.reduce((sum, item) => sum + (item.dividendsReceived || 0), 0);
        const activeInvestments = investments.filter(inv => inv.status === client_1.InvestmentStatus.APPROVED || inv.status === client_1.InvestmentStatus.ACTIVE).length;
        const roi = totalInvested > 0 ? (totalDividendsReceived / totalInvested) * 100 : 0;
        const availableProjects = await this.prisma.project.findMany({
            where: {
                status: client_1.ProjectStatus.ONGOING,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                investments: {
                    where: {
                        status: {
                            in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                        },
                    },
                    select: {
                        amount: true,
                    },
                },
            },
        });
        const availableProjectsWithStats = availableProjects.map(project => {
            const totalInvestment = project.investments.reduce((sum, inv) => sum + inv.amount, 0);
            return Object.assign(Object.assign({}, project), { totalInvestment });
        });
        const projectMap = new Map();
        for (const item of portfolio) {
            const pId = item.project.id;
            const existing = projectMap.get(pId) || {
                projectId: pId,
                projectTitle: item.project.title,
                totalInvested: 0,
                totalReturn: 0,
                roi: 0,
            };
            existing.totalInvested += item.amount;
            existing.totalReturn += (item.totalDividends || 0);
            projectMap.set(pId, existing);
        }
        const projectBreakdown = Array.from(projectMap.values()).map(p => (Object.assign(Object.assign({}, p), { roi: p.totalInvested > 0 ? (p.totalReturn / p.totalInvested) * 100 : 0 })));
        return {
            totalInvested,
            totalDividendsReceived,
            pendingDividends: 0,
            activeInvestments,
            investments: portfolio.map(item => ({
                investment: item,
                project: item.project,
                dividendsReceived: item.dividendsReceived || 0,
                pendingDividends: 0,
                roi: item.amount > 0 ? ((item.dividendsReceived || 0) / item.amount) * 100 : 0,
            })),
            availableProjects: availableProjectsWithStats,
            totalReturn: totalDividendsReceived,
            roi,
            activeProjects: activeInvestments,
            projectBreakdown,
        };
    }
    async getInvestmentHistory(investorId) {
        return this.prisma.investment.findMany({
            where: { investorId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getDividendHistory(investorId) {
        const investments = await this.prisma.investment.findMany({
            where: { investorId },
            include: {
                project: {
                    include: {
                        dividends: true,
                        investments: {
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
            },
        });
        const dividendHistory = [];
        investments.forEach(investment => {
            const totalProjectInvestment = investment.project.investments.reduce((sum, inv) => sum + inv.amount, 0);
            const investorShare = investment.amount / totalProjectInvestment;
            investment.project.dividends.forEach(dividend => {
                dividendHistory.push({
                    id: dividend.id,
                    projectId: investment.project.id,
                    projectTitle: investment.project.title,
                    totalDividend: dividend.amount,
                    investorDividend: dividend.amount * investorShare,
                    investorShare: investorShare * 100,
                    date: dividend.date,
                    createdAt: dividend.createdAt,
                });
            });
        });
        return dividendHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    async getAllProjectsForAdmin() {
        return this.prisma.project.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                investments: {
                    include: {
                        investor: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                reports: true,
                dividends: true,
                _count: {
                    select: {
                        investments: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getProjectStatistics() {
        const totalProjects = await this.prisma.project.count();
        const approvedProjects = await this.prisma.project.count({
            where: { status: client_1.ProjectStatus.APPROVED },
        });
        const pendingProjects = await this.prisma.project.count({
            where: { status: client_1.ProjectStatus.PENDING },
        });
        const totalInvestments = await this.prisma.investment.aggregate({
            _sum: {
                amount: true,
            },
        });
        const totalInvestors = await this.prisma.investment.groupBy({
            by: ['investorId'],
        });
        return {
            totalProjects,
            approvedProjects,
            pendingProjects,
            totalInvestmentAmount: totalInvestments._sum.amount || 0,
            totalInvestors: totalInvestors.length,
        };
    }
    async createInvestmentRequest(investorId, projectId, chatId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.status !== client_1.ProjectStatus.APPROVED) {
            throw new common_1.ForbiddenException('Cannot invest in a project that is not approved');
        }
        const existingInvestment = await this.prisma.investment.findFirst({
            where: {
                investorId,
                projectId,
                status: {
                    in: [client_1.InvestmentStatus.PENDING, client_1.InvestmentStatus.TRANSFER_PENDING, client_1.InvestmentStatus.TRANSFER_UPLOADED],
                },
            },
        });
        if (existingInvestment) {
            throw new common_1.BadRequestException('You already have a pending investment for this project');
        }
        const investment = await this.prisma.investment.create({
            data: {
                investorId,
                projectId,
                chatId,
                status: client_1.InvestmentStatus.PENDING,
                amount: 0,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        bankName: true,
                        accountNumber: true,
                        accountHolder: true,
                    },
                },
                investor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        try {
            await this.notificationService.notifyNewInvestmentRequest(projectId, investment.investor.email, 0);
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
        return investment;
    }
    async getProjectDetailsForInvestor(investorId, projectId) {
        const investment = await this.prisma.investment.findFirst({
            where: {
                investorId,
                projectId,
                status: {
                    in: [client_1.InvestmentStatus.PENDING, client_1.InvestmentStatus.TRANSFER_PENDING, client_1.InvestmentStatus.TRANSFER_UPLOADED, client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                },
            },
        });
        if (!investment) {
            throw new common_1.ForbiddenException('You do not have access to this project details');
        }
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return Object.assign(Object.assign({}, project), { investment: {
                id: investment.id,
                status: investment.status,
                amount: investment.amount,
            } });
    }
    async approveInvestment(adminId, investmentId, data) {
        const investment = await this.prisma.investment.findUnique({
            where: { id: investmentId },
            include: {
                project: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                investor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!investment) {
            throw new common_1.NotFoundException('Investment not found');
        }
        if (investment.status !== client_1.InvestmentStatus.PENDING &&
            investment.status !== client_1.InvestmentStatus.TRANSFER_PENDING &&
            investment.status !== client_1.InvestmentStatus.TRANSFER_UPLOADED) {
            throw new common_1.BadRequestException('Investment must be in pending or transfer pending/uploaded status for approval');
        }
        const updatedInvestment = await this.prisma.investment.update({
            where: { id: investmentId },
            data: {
                amount: (data === null || data === void 0 ? void 0 : data.amount) || investment.amount,
                status: client_1.InvestmentStatus.APPROVED,
                approvedBy: adminId,
                approvedAt: new Date(),
            },
            include: {
                project: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                investor: {
                    select: {
                        id: true,
                        email: true,
                        fullname: true,
                    },
                },
            },
        });
        await this.prisma.project.update({
            where: { id: investment.project.id },
            data: {
                currentAmount: {
                    increment: updatedInvestment.amount,
                },
            },
        });
        try {
            await this.notificationService.notifyInvestmentApproved(investmentId);
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
        return updatedInvestment;
    }
    async rejectInvestment(adminId, investmentId, data) {
        const investment = await this.prisma.investment.findUnique({
            where: { id: investmentId },
        });
        if (!investment) {
            throw new common_1.NotFoundException('Investment not found');
        }
        if (investment.status === client_1.InvestmentStatus.APPROVED || investment.status === client_1.InvestmentStatus.ACTIVE) {
            throw new common_1.BadRequestException('Cannot reject an already approved investment');
        }
        const updatedInvestment = await this.prisma.investment.update({
            where: { id: investmentId },
            data: {
                status: client_1.InvestmentStatus.REJECTED,
                rejectedReason: data.rejectedReason,
                approvedBy: adminId,
                approvedAt: new Date(),
            },
            include: {
                project: {
                    select: { id: true, title: true }
                },
                investor: {
                    select: { id: true, email: true, fullname: true }
                }
            }
        });
        try {
            await this.notificationService.notifyInvestmentRejected(investmentId, data.rejectedReason);
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
        return updatedInvestment;
    }
    async getAllInvestmentsForAdmin(page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [investments, total] = await Promise.all([
            this.prisma.investment.findMany({
                where,
                include: {
                    project: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                        },
                    },
                    investor: {
                        select: {
                            id: true,
                            email: true,
                            fullname: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.investment.count({ where }),
        ]);
        const investmentsMapped = investments.map((inv) => {
            const _a = inv.investor || {}, { fullname } = _a, restInvestor = __rest(_a, ["fullname"]);
            return Object.assign(Object.assign({}, inv), { investor: Object.assign(Object.assign({}, restInvestor), { fullName: fullname !== null && fullname !== void 0 ? fullname : null }) });
        });
        return {
            data: investmentsMapped,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getPendingInvestments() {
        const investments = await this.prisma.investment.findMany({
            where: {
                status: {
                    in: [client_1.InvestmentStatus.TRANSFER_UPLOADED],
                },
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                investor: {
                    select: {
                        id: true,
                        email: true,
                        fullname: true,
                    },
                },
            },
        });
        return investments.map((inv) => {
            const _a = inv.investor || {}, { fullname } = _a, restInvestor = __rest(_a, ["fullname"]);
            return Object.assign(Object.assign({}, inv), { investor: Object.assign(Object.assign({}, restInvestor), { fullName: fullname !== null && fullname !== void 0 ? fullname : null }) });
        });
    }
    async getPendingProjectsCount() {
        const count = await this.prisma.project.count({
            where: {
                status: client_1.ProjectStatus.PENDING
            }
        });
        return { count };
    }
    async getInvestorApprovedProjects(investorId) {
        const investments = await this.prisma.investment.findMany({
            where: {
                investorId,
                status: {
                    in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                },
            },
            include: {
                project: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                        reports: {
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                        dividends: {
                            orderBy: {
                                date: 'desc',
                            },
                        },
                        investments: {
                            where: {
                                status: {
                                    in: [client_1.InvestmentStatus.APPROVED, client_1.InvestmentStatus.ACTIVE],
                                },
                            },
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
            },
        });
        return investments.map(investment => {
            const totalProjectInvestment = investment.project.investments.reduce((sum, inv) => sum + inv.amount, 0);
            const investorShare = totalProjectInvestment > 0 ? (investment.amount / totalProjectInvestment) * 100 : 0;
            const totalDividends = investment.project.dividends.reduce((sum, div) => sum + (div.amount * (investment.amount / totalProjectInvestment)), 0);
            return Object.assign(Object.assign({}, investment), { investorShare,
                totalDividends, project: Object.assign(Object.assign({}, investment.project), { totalInvestment: totalProjectInvestment }) });
        });
    }
    async getInvestmentById(investmentId, userId, userRole) {
        const investment = await this.prisma.investment.findUnique({
            where: { id: investmentId },
            include: {
                project: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                investor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!investment) {
            throw new common_1.NotFoundException('Investment not found');
        }
        if (userRole !== client_1.Role.ADMIN && userRole !== client_1.Role.SUPER_ADMIN) {
            if (investment.investorId !== userId && investment.project.ownerId !== userId) {
                throw new common_1.ForbiddenException('You do not have access to this investment');
            }
        }
        return investment;
    }
    async getProjectInvestments(projectId, ownerId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                ownerId: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only view investments for your own projects');
        }
        return this.prisma.investment.findMany({
            where: { projectId },
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                transferDate: true,
                transferProofUrl: true,
                transferProofFileName: true,
                approvedAt: true,
                rejectedReason: true,
                investor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getProspectusInfo(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                prospectusUrl: true,
                prospectusFileName: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!project.prospectusUrl) {
            throw new common_1.NotFoundException('Prospectus not found for this project');
        }
        return {
            prospectusUrl: project.prospectusUrl,
            prospectusFileName: project.prospectusFileName,
        };
    }
};
exports.InvestmentService = InvestmentService;
exports.InvestmentService = InvestmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], InvestmentService);
//# sourceMappingURL=investment.service.js.map