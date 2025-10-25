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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(jwt, chatService) {
        this.jwt = jwt;
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            const payload = this.jwt.verify(token);
            client.user = { id: payload.sub || payload.id, email: payload.email, role: payload.role };
            this.logger.log(`Socket connected ${client.id} user=${client.user.id}`);
        }
        catch (e) {
            this.logger.warn(`Unauthorized socket: ${e === null || e === void 0 ? void 0 : e.message}`);
            client.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        this.logger.log(`Socket disconnected ${client.id}`);
    }
    async onJoinRoom(client, payload) {
        if (!client.user)
            return client.disconnect(true);
        const { chatId } = payload || {};
        if (!chatId)
            return;
        await this.chatService.ensureParticipant(chatId, client.user.id);
        client.join(chatId);
        client.emit('joined', { chatId });
    }
    async onTyping(client, payload) {
        if (!client.user)
            return;
        const { chatId, typing } = payload || {};
        if (!chatId)
            return;
        client.to(chatId).emit('typing', { chatId, userId: client.user.id, typing: !!typing });
    }
    async onSendMessage(client, payload) {
        if (!client.user)
            return client.disconnect(true);
        const { chatId, content } = payload || {};
        if (!chatId || !content)
            return;
        const msg = await this.chatService.postMessage(chatId, client.user.id, content);
        this.server.to(chatId).emit('message', { chatId, message: msg });
        return { ok: true };
    }
    extractToken(client) {
        var _a;
        const auth = (client.handshake.headers['authorization'] || client.handshake.headers['Authorization']);
        if (auth && auth.startsWith('Bearer '))
            return auth.slice(7);
        const qtoken = ((_a = client.handshake.query) === null || _a === void 0 ? void 0 : _a.token) || '';
        if (qtoken)
            return qtoken;
        throw new Error('Missing token');
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onSendMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ namespace: '/chat', cors: { origin: '*' } }),
    __metadata("design:paramtypes", [jwt_1.JwtService, chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map