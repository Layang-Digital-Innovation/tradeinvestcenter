import { Job } from 'bull';
import { WhatsappService } from './whatsapp.service';
export declare class ChatProcessor {
    private readonly whatsappService;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    handleSendText(job: Job): Promise<any>;
}
