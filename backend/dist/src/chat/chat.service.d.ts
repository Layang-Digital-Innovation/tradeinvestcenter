import { PrismaService } from '../prisma/prisma.service';
import { ChatType, Role } from '@prisma/client';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    ensureParticipant(chatId: string, userId: string): Promise<void>;
    startChat(requesterId: string, payload: {
        type?: ChatType;
        projectId?: string;
        title?: string;
    }): Promise<{
        participants: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                fullname: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                kycDocs: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ChatParticipantRole;
            userId: string;
            chatId: string;
            lastReadAt: Date | null;
            lastReadMessageId: string | null;
            isMuted: boolean;
            joinedAt: Date;
            leftAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ChatStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        projectId: string | null;
        title: string | null;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    startChatWithUser(requesterId: string, targetUserId: string, payload: {
        type?: ChatType;
        title?: string;
    }): Promise<{
        participants: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                fullname: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                kycDocs: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ChatParticipantRole;
            userId: string;
            chatId: string;
            lastReadAt: Date | null;
            lastReadMessageId: string | null;
            isMuted: boolean;
            joinedAt: Date;
            leftAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ChatStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        projectId: string | null;
        title: string | null;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    getChatById(chatId: string, requesterId: string): Promise<{
        participants: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                fullname: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                kycDocs: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.ChatParticipantRole;
            userId: string;
            chatId: string;
            lastReadAt: Date | null;
            lastReadMessageId: string | null;
            isMuted: boolean;
            joinedAt: Date;
            leftAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ChatStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        projectId: string | null;
        title: string | null;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    listMyChats(userId: string): Promise<any[]>;
    defaultTitle(users: Array<{
        fullname: string;
        role: Role;
    }>): "Chat with Admin" | "Support Chat";
    getMessages(chatId: string, userId: string, params?: {
        cursor?: string;
        limit?: number;
    }): Promise<({
        sender: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            fullname: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            kycDocs: string | null;
        };
        attachments: {
            id: string;
            createdAt: Date;
            originalName: string;
            mimeType: string;
            fileUrl: string;
            fileName: string;
            fileSize: number;
            messageId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        chatId: string;
        senderId: string;
        content: string | null;
        replyToId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        deletedAt: Date | null;
    })[]>;
    postMessage(chatId: string, userId: string, content: string): Promise<{
        sender: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            fullname: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            kycDocs: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        chatId: string;
        senderId: string;
        content: string | null;
        replyToId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        deletedAt: Date | null;
    }>;
    addMessageAttachments(chatId: string, userId: string, files: Array<{
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        fileUrl: string;
    }>): Promise<{
        sender: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            fullname: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            kycDocs: string | null;
        };
        attachments: {
            id: string;
            createdAt: Date;
            originalName: string;
            mimeType: string;
            fileUrl: string;
            fileName: string;
            fileSize: number;
            messageId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        chatId: string;
        senderId: string;
        content: string | null;
        replyToId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        deletedAt: Date | null;
    }>;
}
