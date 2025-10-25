import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaypalConfigService } from './paypal.config';
import { SubscriptionPlan } from '@prisma/client';
export declare class PaypalSubscriptionService {
    private prisma;
    private configService;
    private paypalConfigService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService, paypalConfigService: PaypalConfigService);
    createBillingPlan(plan: SubscriptionPlan, price: number, period?: 'MONTHLY' | 'YEARLY', name?: string): Promise<unknown>;
    createBillingAgreement(userId: string, planId: string, billingPlanId: string): Promise<unknown>;
    executeBillingAgreement(token: string): Promise<unknown>;
}
