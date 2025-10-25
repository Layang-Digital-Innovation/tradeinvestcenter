import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getMyNotifications(req: any, page?: string, limit?: string): Promise<{
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
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(notificationId: string, req: any): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
}
