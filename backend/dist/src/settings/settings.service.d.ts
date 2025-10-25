import { PrismaService } from '../prisma/prisma.service';
export interface PlatformBankSettingsDto {
    bankName?: string | null;
    accountName?: string | null;
    accountNumber?: string | null;
    instruction?: string | null;
}
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlatformBankSettings(): Promise<{
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
    upsertPlatformBankSettings(data: PlatformBankSettingsDto, updatedByUserId?: string): Promise<{
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
