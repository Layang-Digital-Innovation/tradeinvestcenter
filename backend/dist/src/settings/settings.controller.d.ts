import { SettingsService, PlatformBankSettingsDto } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPlatformBank(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bankName: string | null;
        accountName: string | null;
        accountNumber: string | null;
        instruction: string | null;
        updatedByUserId: string | null;
    } | {
        id: string;
        bankName: any;
        accountName: any;
        accountNumber: any;
        instruction: any;
    }>;
    updatePlatformBank(body: PlatformBankSettingsDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bankName: string | null;
        accountName: string | null;
        accountNumber: string | null;
        instruction: string | null;
        updatedByUserId: string | null;
    }>;
}
