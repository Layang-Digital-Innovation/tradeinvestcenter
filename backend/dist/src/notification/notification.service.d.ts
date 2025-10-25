import { PrismaService } from '../prisma/prisma.service';
export interface NotificationData {
    userId: string;
    title: string;
    message: string;
    type: 'INVESTMENT_REQUEST' | 'INVESTMENT_APPROVED' | 'INVESTMENT_REJECTED' | 'TRANSFER_UPLOADED' | 'DIVIDEND_DISTRIBUTED' | 'NEW_PROJECT';
    relatedId?: string;
    metadata?: any;
}
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(data: NotificationData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        relatedId: string | null;
        isRead: boolean;
        readAt: Date | null;
    }>;
    notifyNewInvestmentRequest(projectId: string, investorName: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        relatedId: string | null;
        isRead: boolean;
        readAt: Date | null;
    }>;
    notifyTransferProofUploaded(investmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        relatedId: string | null;
        isRead: boolean;
        readAt: Date | null;
    }>;
    notifyInvestmentApproved(investmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        relatedId: string | null;
        isRead: boolean;
        readAt: Date | null;
    }>;
    notifyInvestmentRejected(investmentId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        relatedId: string | null;
        isRead: boolean;
        readAt: Date | null;
    }>;
    notifyDividendDistributed(dividendId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        relatedId: string | null;
        isRead: boolean;
        readAt: Date | null;
    }[]>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            message: string;
            type: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
            relatedId: string | null;
            isRead: boolean;
            readAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
}
