import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
export declare class WhatsappService {
    private configService;
    private whatsappQueue;
    private readonly logger;
    private readonly apiUrl;
    private readonly session;
    constructor(configService: ConfigService, whatsappQueue: Queue);
    sendTextMessage(chatId: string, text: string): Promise<{
        success: boolean;
        message: string;
    }>;
    processTextMessage(chatId: string, text: string): Promise<any>;
    getWhatsAppStatus(): Promise<any>;
}
