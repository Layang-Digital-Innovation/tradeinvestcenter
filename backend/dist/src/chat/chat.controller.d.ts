import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
export declare class ChatController {
    private chatService;
    private gateway;
    constructor(chatService: ChatService, gateway: ChatGateway);
    start(req: any, body: {
        type?: string;
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
    startWith(req: any, body: {
        targetUserId: string;
        type?: string;
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
    myChats(req: any): Promise<any[]>;
    getMessages(req: any, id: string, cursor?: string, limit?: string): Promise<({
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
    postMessage(req: any, id: string, content: string): Promise<{
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
    uploadAttachments(req: any, id: string, files: Express.Multer.File[]): Promise<{
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
