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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const axios_1 = require("axios");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    constructor(configService, whatsappQueue) {
        this.configService = configService;
        this.whatsappQueue = whatsappQueue;
        this.logger = new common_1.Logger(WhatsappService_1.name);
        this.apiUrl = this.configService.get('WAHA_API_URL');
        this.session = this.configService.get('WAHA_SESSION');
    }
    async sendTextMessage(chatId, text) {
        try {
            await this.whatsappQueue.add('send-text', {
                chatId,
                text,
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            });
            return { success: true, message: 'Message queued successfully' };
        }
        catch (error) {
            this.logger.error(`Failed to queue message: ${error.message}`);
            throw error;
        }
    }
    async processTextMessage(chatId, text) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/sendText`, {
                session: this.session,
                chatId,
                text,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
            throw error;
        }
    }
    async getWhatsAppStatus() {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/${this.session}/status`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get WhatsApp status: ${error.message}`);
            throw error;
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('whatsapp')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map