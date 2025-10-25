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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureParticipant(chatId, userId) {
        const exists = await this.prisma.chatParticipant.findFirst({ where: { chatId, userId } });
        if (!exists)
            throw new common_1.UnauthorizedException('Not a participant of this chat');
    }
    async startChat(requesterId, payload) {
        const requester = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
        const isInvestmentUser = (requester === null || requester === void 0 ? void 0 : requester.role) === client_1.Role.INVESTOR || (requester === null || requester === void 0 ? void 0 : requester.role) === client_1.Role.PROJECT_OWNER;
        const isTradingUser = (requester === null || requester === void 0 ? void 0 : requester.role) === client_1.Role.BUYER || (requester === null || requester === void 0 ? void 0 : requester.role) === client_1.Role.SELLER;
        const type = payload.type || (isInvestmentUser ? client_1.ChatType.INVESTMENT_INQUIRY : client_1.ChatType.TRADING_SUPPORT);
        const chat = await this.prisma.chat.create({
            data: {
                type,
                status: client_1.ChatStatus.ACTIVE,
                projectId: payload.projectId || null,
                title: payload.title || null,
                participants: {
                    create: [{ userId: requesterId }],
                },
            },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                OR: [
                    { role: client_1.Role.SUPER_ADMIN },
                    ...(isInvestmentUser ? [{ role: client_1.Role.ADMIN_INVESTMENT }] : []),
                    ...(isTradingUser ? [{ role: client_1.Role.ADMIN_TRADING }] : []),
                ],
            },
        });
        if (admins.length) {
            await this.prisma.chatParticipant.createMany({
                data: admins.map((a) => ({ chatId: chat.id, userId: a.id })),
                skipDuplicates: true,
            });
        }
        return this.getChatById(chat.id, requesterId);
    }
    async startChatWithUser(requesterId, targetUserId, payload) {
        if (requesterId === targetUserId) {
            return this.startChat(requesterId, { type: payload.type, title: payload.title });
        }
        const requester = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
        const isInvestmentUser = (requester === null || requester === void 0 ? void 0 : requester.role) === client_1.Role.INVESTOR || (requester === null || requester === void 0 ? void 0 : requester.role) === client_1.Role.PROJECT_OWNER;
        const type = payload.type || (isInvestmentUser ? client_1.ChatType.INVESTMENT_INQUIRY : client_1.ChatType.TRADING_SUPPORT);
        const chat = await this.prisma.chat.create({
            data: {
                type,
                status: client_1.ChatStatus.ACTIVE,
                title: payload.title || null,
                participants: {
                    create: [{ userId: requesterId }, { userId: targetUserId }],
                },
            },
        });
        const admins = await this.prisma.user.findMany({
            where: {
                OR: [
                    { role: client_1.Role.SUPER_ADMIN },
                    { role: client_1.Role.ADMIN_TRADING },
                    ...(type === client_1.ChatType.INVESTMENT_INQUIRY ? [{ role: client_1.Role.ADMIN_INVESTMENT }] : []),
                ],
            },
        });
        if (admins.length) {
            await this.prisma.chatParticipant.createMany({
                data: admins.map((a) => ({ chatId: chat.id, userId: a.id })),
                skipDuplicates: true,
            });
        }
        return this.getChatById(chat.id, requesterId);
    }
    async getChatById(chatId, requesterId) {
        await this.ensureParticipant(chatId, requesterId);
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                participants: { include: { user: true } },
            },
        });
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        return chat;
    }
    async listMyChats(userId) {
        const items = await this.prisma.chat.findMany({
            where: { participants: { some: { userId } } },
            orderBy: { lastMessageAt: 'desc' },
            include: {
                participants: { include: { user: true } },
            },
        });
        const result = [];
        for (const c of items) {
            const participant = c.participants.find((p) => p.userId === userId);
            const lastReadAt = (participant === null || participant === void 0 ? void 0 : participant.lastReadAt) || null;
            const unreadCount = await this.prisma.message.count({
                where: {
                    chatId: c.id,
                    createdAt: lastReadAt ? { gt: lastReadAt } : undefined,
                    NOT: { senderId: userId },
                },
            });
            result.push({
                id: c.id,
                type: c.type,
                title: c.title || this.defaultTitle(c.participants.map((p) => p.user)),
                lastMessage: c.lastMessage || '',
                lastMessageAt: c.lastMessageAt || null,
                participants: c.participants.map((p) => ({ id: p.user.id, fullname: p.user.fullname, role: p.user.role })),
                unreadCount,
            });
        }
        return result;
    }
    defaultTitle(users) {
        const admin = users.find((u) => [client_1.Role.ADMIN, client_1.Role.ADMIN_INVESTMENT, client_1.Role.ADMIN_TRADING, client_1.Role.SUPER_ADMIN].includes(u.role));
        return admin ? `Chat with Admin` : `Support Chat`;
    }
    async getMessages(chatId, userId, params) {
        await this.ensureParticipant(chatId, userId);
        const take = Math.min((params === null || params === void 0 ? void 0 : params.limit) || 20, 50);
        const where = { chatId };
        const cursor = (params === null || params === void 0 ? void 0 : params.cursor) ? { id: params.cursor } : undefined;
        const items = await this.prisma.message.findMany(Object.assign(Object.assign({ where, orderBy: { createdAt: 'desc' }, take }, (cursor ? { cursor, skip: 1 } : {})), { include: { sender: true, attachments: true } }));
        await this.prisma.chatParticipant.updateMany({
            where: { chatId, userId },
            data: { lastReadAt: new Date(), lastReadMessageId: items.length ? items[items.length - 1].id : undefined },
        });
        return items.reverse();
    }
    async postMessage(chatId, userId, content) {
        await this.ensureParticipant(chatId, userId);
        const msg = await this.prisma.message.create({
            data: {
                chatId,
                senderId: userId,
                content,
                type: client_1.MessageType.TEXT,
            },
            include: { sender: true },
        });
        await this.prisma.chat.update({
            where: { id: chatId },
            data: { lastMessage: content, lastMessageAt: new Date() },
        });
        return msg;
    }
    async addMessageAttachments(chatId, userId, files) {
        await this.ensureParticipant(chatId, userId);
        const message = await this.prisma.message.create({
            data: {
                chatId,
                senderId: userId,
                type: 'FILE',
                attachments: {
                    create: files.map((f) => ({
                        fileName: f.fileName,
                        originalName: f.originalName,
                        fileSize: f.fileSize,
                        mimeType: f.mimeType,
                        fileUrl: f.fileUrl,
                    })),
                },
            },
            include: { attachments: true, sender: true },
        });
        await this.prisma.chat.update({ where: { id: chatId }, data: { lastMessage: '[attachment]', lastMessageAt: new Date() } });
        return message;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map