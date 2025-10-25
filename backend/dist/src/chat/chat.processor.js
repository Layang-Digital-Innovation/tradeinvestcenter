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
var ChatProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
let ChatProcessor = ChatProcessor_1 = class ChatProcessor {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
        this.logger = new common_1.Logger(ChatProcessor_1.name);
    }
    async handleSendText(job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
        const { chatId, text } = job.data;
        try {
            const result = await this.whatsappService.processTextMessage(chatId, text);
            this.logger.debug(`Message sent successfully: ${JSON.stringify(result)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to process message: ${error.message}`);
            throw error;
        }
    }
};
exports.ChatProcessor = ChatProcessor;
__decorate([
    (0, bull_1.Process)('send-text'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatProcessor.prototype, "handleSendText", null);
exports.ChatProcessor = ChatProcessor = ChatProcessor_1 = __decorate([
    (0, bull_1.Processor)('whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], ChatProcessor);
//# sourceMappingURL=chat.processor.js.map