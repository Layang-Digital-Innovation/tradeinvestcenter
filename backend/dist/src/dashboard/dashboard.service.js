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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInvestorDashboard(userId) {
        const investments = await this.prisma.investment.findMany({
            where: { investorId: userId },
            include: {
                project: true,
            },
        });
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const projectCount = new Set(investments.map(inv => inv.projectId)).size;
        return {
            totalInvested,
            projectCount,
            investments,
        };
    }
    async getProjectOwnerDashboard(userId) {
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            include: {
                investments: true,
                dividends: true,
            },
        });
        const totalRaised = projects.reduce((sum, project) => sum + project.investments.reduce((s, inv) => s + inv.amount, 0), 0);
        const totalDividends = projects.reduce((sum, project) => sum + project.dividends.reduce((s, div) => s + div.amount, 0), 0);
        return {
            projectCount: projects.length,
            totalRaised,
            totalDividends,
            projects,
        };
    }
    async getBuyerDashboard(userId) {
        const orders = await this.prisma.order.findMany({
            where: { buyerId: userId },
            include: {
                product: true,
                shipment: true,
            },
        });
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        return {
            orderCount: orders.length,
            totalSpent,
            orders,
        };
    }
    async getSellerDashboard(userId) {
        const products = await this.prisma.product.findMany({
            where: { sellerId: userId },
            include: {
                orders: true,
            },
        });
        const totalSales = products.reduce((sum, product) => sum + product.orders.reduce((s, order) => s + (order.totalPrice || 0), 0), 0);
        const orderCount = products.reduce((sum, product) => sum + product.orders.length, 0);
        return {
            productCount: products.length,
            orderCount,
            totalSales,
            products,
        };
    }
    async getAdminDashboard() {
        const [userCount, investorCount, projectOwnerCount, buyerCount, sellerCount, projectCount, orderCount, activeSubscriptions,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: client_1.Role.INVESTOR } }),
            this.prisma.user.count({ where: { role: client_1.Role.PROJECT_OWNER } }),
            this.prisma.user.count({ where: { role: client_1.Role.BUYER } }),
            this.prisma.user.count({ where: { role: client_1.Role.SELLER } }),
            this.prisma.project.count(),
            this.prisma.order.count(),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        ]);
        return {
            userCount,
            investorCount,
            projectOwnerCount,
            buyerCount,
            sellerCount,
            projectCount,
            orderCount,
            activeSubscriptions,
        };
    }
    async getInvestorSummary(userId) {
        const investments = await this.prisma.investment.findMany({
            where: { investorId: userId },
        });
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const projectCount = new Set(investments.map(inv => inv.projectId)).size;
        return {
            totalInvested,
            projectCount,
            investmentCount: investments.length,
        };
    }
    async getProjectOwnerSummary(userId) {
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            include: {
                investments: true,
                dividends: true,
            },
        });
        const totalRaised = projects.reduce((sum, project) => sum + project.investments.reduce((s, inv) => s + inv.amount, 0), 0);
        const totalDividends = projects.reduce((sum, project) => sum + project.dividends.reduce((s, div) => s + div.amount, 0), 0);
        return {
            projectCount: projects.length,
            totalRaised,
            totalDividends,
        };
    }
    async getAdminSummary() {
        const [userCount, projectCount, totalInvestments, activeSubscriptions,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.project.count(),
            this.prisma.investment.aggregate({
                _sum: { amount: true },
            }),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        ]);
        return {
            userCount,
            projectCount,
            totalInvestments: totalInvestments._sum.amount || 0,
            activeSubscriptions,
        };
    }
    async getInvestorStats(userId) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const investments = await this.prisma.investment.findMany({
            where: {
                investorId: userId,
                createdAt: { gte: sixMonthsAgo },
            },
            orderBy: { createdAt: 'asc' },
        });
        const dividends = await this.prisma.dividend.findMany({
            where: {
                project: {
                    investments: {
                        some: {
                            investorId: userId
                        }
                    }
                },
                createdAt: { gte: sixMonthsAgo },
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            investmentTrend: this.groupByMonth(investments, 'amount'),
            dividendTrend: this.groupByMonth(dividends, 'amount'),
        };
    }
    async getProjectOwnerStats(userId) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            select: { id: true },
        });
        const projectIds = projects.map(p => p.id);
        const investments = await this.prisma.investment.findMany({
            where: {
                projectId: { in: projectIds },
                createdAt: { gte: sixMonthsAgo },
            },
            orderBy: { createdAt: 'asc' },
        });
        const dividends = await this.prisma.dividend.findMany({
            where: {
                projectId: { in: projectIds },
                createdAt: { gte: sixMonthsAgo },
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            investmentTrend: this.groupByMonth(investments, 'amount'),
            dividendTrend: this.groupByMonth(dividends, 'amount'),
        };
    }
    async getAdminStats() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const users = await this.prisma.user.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            orderBy: { createdAt: 'asc' },
        });
        const investments = await this.prisma.investment.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            orderBy: { createdAt: 'asc' },
        });
        const subscriptions = await this.prisma.subscription.findMany({
            where: { startedAt: { gte: sixMonthsAgo } },
            orderBy: { startedAt: 'asc' },
        });
        return {
            userGrowth: this.groupByMonth(users),
            investmentTrend: this.groupByMonth(investments, 'amount'),
            subscriptionTrend: this.groupByMonth(subscriptions),
        };
    }
    async getUserAnalytics() {
        const [totalUsers, usersByRole, recentUsers, userGrowthData] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: { role: true },
            }),
            this.prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.findMany({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
        return {
            totalUsers,
            usersByRole: usersByRole.map(item => ({
                role: item.role,
                count: item._count.role,
            })),
            recentUsers,
            userGrowth: this.groupByMonth(userGrowthData),
        };
    }
    async getSubscriptionAnalytics(currency) {
        const [totalSubscriptions, activeSubscriptions, subscriptionsByPlan, recentSubscriptions, revenueAll, revenueByProvider, revenueByCurrency,] = await Promise.all([
            this.prisma.subscription.count(),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            this.prisma.subscription.groupBy({
                by: ['plan'],
                _count: { plan: true },
            }),
            this.prisma.subscription.findMany({
                take: 10,
                orderBy: { startedAt: 'desc' },
                include: {
                    user: {
                        select: { email: true, role: true },
                    },
                },
            }),
            this.prisma.payment.aggregate({
                where: Object.assign({ status: client_1.PaymentStatus.PAID, paymentType: client_1.PaymentType.RECURRING }, (currency ? { currency: client_1.Currency[currency] } : {})),
                _sum: { amount: true },
            }),
            this.prisma.payment.groupBy({
                by: ['provider'],
                where: Object.assign({ status: client_1.PaymentStatus.PAID, paymentType: client_1.PaymentType.RECURRING }, (currency ? { currency: client_1.Currency[currency] } : {})),
                _sum: { amount: true },
                _count: { provider: true },
            }),
            this.prisma.payment.groupBy({
                by: ['currency'],
                where: {
                    status: client_1.PaymentStatus.PAID,
                    paymentType: client_1.PaymentType.RECURRING,
                },
                _sum: { amount: true },
                _count: { currency: true },
            }),
        ]);
        return {
            totalSubscriptions,
            activeSubscriptions,
            subscriptionsByPlan: subscriptionsByPlan.map(item => ({
                plan: item.plan,
                count: item._count.plan,
            })),
            recentSubscriptions,
            totalRevenue: revenueAll._sum.amount || 0,
            revenueByProvider: revenueByProvider.map(r => ({
                provider: r.provider,
                amount: r._sum.amount || 0,
                count: r._count.provider,
            })),
            revenueByCurrency: revenueByCurrency.map(r => ({
                currency: r.currency,
                amount: r._sum.amount || 0,
                count: r._count.currency,
            })),
            currency: currency || null,
        };
    }
    async getRevenueAnalytics() {
        const [totalRevenue, monthlyRevenue, revenueByType, recentPayments] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { status: client_1.PaymentStatus.PAID },
                _sum: { amount: true },
            }),
            this.prisma.payment.findMany({
                where: {
                    status: client_1.PaymentStatus.PAID,
                    createdAt: {
                        gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.payment.groupBy({
                by: ['paymentType'],
                where: { status: client_1.PaymentStatus.PAID },
                _sum: { amount: true },
                _count: { paymentType: true },
            }),
            this.prisma.payment.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                where: { status: client_1.PaymentStatus.PAID },
                include: {
                    user: {
                        select: { email: true, role: true },
                    },
                },
            }),
        ]);
        return {
            totalRevenue: totalRevenue._sum.amount || 0,
            monthlyRevenue: this.groupByMonth(monthlyRevenue, 'amount'),
            revenueByType: revenueByType.map(item => ({
                type: item.paymentType,
                amount: item._sum.amount || 0,
                count: item._count.paymentType,
            })),
            recentPayments,
        };
    }
    groupByMonth(items, valueField) {
        const monthlyData = {};
        items.forEach(item => {
            const date = new Date(item.createdAt);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = valueField ? 0 : 1;
            }
            else {
                monthlyData[monthYear] += valueField ? item[valueField] : 1;
            }
        });
        return Object.entries(monthlyData).map(([month, value]) => ({
            month,
            value,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map