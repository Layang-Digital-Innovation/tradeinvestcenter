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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const chat_gateway_1 = require("./chat.gateway");
let ChatController = class ChatController {
    constructor(chatService, gateway) {
        this.chatService = chatService;
        this.gateway = gateway;
    }
    async start(req, body) {
        return this.chatService.startChat(req.user.id, {
            type: body.type,
            projectId: body.projectId,
            title: body.title,
        });
    }
    async startWith(req, body) {
        return this.chatService.startChatWithUser(req.user.id, body.targetUserId, {
            type: body.type,
            title: body.title,
        });
    }
    async myChats(req) {
        return this.chatService.listMyChats(req.user.id);
    }
    async getMessages(req, id, cursor, limit) {
        return this.chatService.getMessages(id, req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
    }
    async postMessage(req, id, content) {
        const msg = await this.chatService.postMessage(id, req.user.id, content);
        this.gateway.server.to(id).emit('message', { chatId: id, message: msg });
        return msg;
    }
    async uploadAttachments(req, id, files) {
        const list = (files || []).map((f) => ({
            fileName: f.filename,
            originalName: f.originalname,
            fileSize: f.size,
            mimeType: f.mimetype,
            fileUrl: `/uploads/chat-attachments/${f.filename}`,
        }));
        const msg = await this.chatService.addMessageAttachments(id, req.user.id, list);
        this.gateway.server.to(id).emit('message', { chatId: id, message: msg });
        return msg;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('start-with'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "startWith", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "myChats", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "postMessage", null);
__decorate([
    (0, common_1.Post)(':id/attachments'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const dest = (0, path_1.join)(process.cwd(), 'uploads', 'chat-attachments');
                if (!fs.existsSync(dest))
                    fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = `chat-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|txt)$/))
                cb(null, true);
            else
                cb(new Error('Unsupported file type'), false);
        },
        limits: { fileSize: 15 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "uploadAttachments", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService, chat_gateway_1.ChatGateway])
], ChatController);
//# sourceMappingURL=chat.controller.js.map