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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNotification(data) {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    userId: data.userId,
                    title: data.title,
                    message: data.message,
                    type: data.type,
                    relatedId: data.relatedId,
                    metadata: data.metadata,
                    isRead: false,
                },
            });
            return notification;
        }
        catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }
    async notifyNewInvestmentRequest(projectId, investorName, amount) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { owner: true },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return this.createNotification({
            userId: project.ownerId,
            title: 'New Investment Request',
            message: `${investorName} has requested to invest $${amount.toLocaleString()} in your project "${project.title}"`,
            type: 'INVESTMENT_REQUEST',
            relatedId: projectId,
            metadata: {
                projectId,
                investorName,
                amount,
            },
        });
    }
    async notifyTransferProofUploaded(investmentId) {
        const investment = await this.prisma.investment.findUnique({
            where: { id: investmentId },
            include: {
                investor: true,
                project: true,
            },
        });
        if (!investment) {
            throw new Error('Investment not found');
        }
        return this.createNotification({
            userId: investment.project.ownerId,
            title: 'Transfer Proof Uploaded',
            message: `${investment.investor.email} has uploaded transfer proof for their investment in "${investment.project.title}"`,
            type: 'TRANSFER_UPLOADED',
            relatedId: investmentId,
            metadata: {
                investmentId,
                projectId: investment.projectId,
                investorName: investment.investor.email,
                amount: investment.amount,
            },
        });
    }
    async notifyInvestmentApproved(investmentId) {
        const investment = await this.prisma.investment.findUnique({
            where: { id: investmentId },
            include: {
                investor: true,
                project: true,
            },
        });
        if (!investment) {
            throw new Error('Investment not found');
        }
        return this.createNotification({
            userId: investment.investorId,
            title: 'Investment Approved',
            message: `Your investment of $${investment.amount.toLocaleString()} in "${investment.project.title}" has been approved!`,
            type: 'INVESTMENT_APPROVED',
            relatedId: investmentId,
            metadata: {
                investmentId,
                projectId: investment.projectId,
                projectTitle: investment.project.title,
                amount: investment.amount,
            },
        });
    }
    async notifyInvestmentRejected(investmentId, reason) {
        const investment = await this.prisma.investment.findUnique({
            where: { id: investmentId },
            include: {
                investor: true,
                project: true,
            },
        });
        if (!investment) {
            throw new Error('Investment not found');
        }
        return this.createNotification({
            userId: investment.investorId,
            title: 'Investment Rejected',
            message: `Your investment in "${investment.project.title}" has been rejected. Reason: ${reason}`,
            type: 'INVESTMENT_REJECTED',
            relatedId: investmentId,
            metadata: {
                investmentId,
                projectId: investment.projectId,
                projectTitle: investment.project.title,
                amount: investment.amount,
                reason,
            },
        });
    }
    async notifyDividendDistributed(dividendId) {
        const dividend = await this.prisma.dividend.findUnique({
            where: { id: dividendId },
            include: {
                project: true,
                distributions: {
                    include: {
                        investor: true,
                    },
                },
            },
        });
        if (!dividend) {
            throw new Error('Dividend not found');
        }
        const notifications = dividend.distributions.map(distribution => this.createNotification({
            userId: distribution.investorId,
            title: 'Dividend Distributed',
            message: `You have received a dividend of $${distribution.amount.toLocaleString()} from "${dividend.project.title}"`,
            type: 'DIVIDEND_DISTRIBUTED',
            relatedId: dividendId,
            metadata: {
                dividendId,
                projectId: dividend.projectId,
                projectTitle: dividend.project.title,
                amount: distribution.amount,
                percentage: distribution.percentage,
            },
        }));
        return Promise.all(notifications);
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({
                where: { userId },
            }),
        ]);
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            unreadCount: await this.prisma.notification.count({
                where: { userId, isRead: false },
            }),
        };
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map