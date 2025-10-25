import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan } from '@prisma/client';
import { XenditSubscriptionService } from './xendit-subscription.service';
import { PaypalSubscriptionService } from './paypal-subscription.service';
import { PaymentService } from './payment.service';
interface CheckoutInput {
    userId: string;
    type: 'subscription' | 'one_time';
    plan?: SubscriptionPlan;
    price?: number;
    currency?: 'IDR' | 'USD';
    provider?: 'xendit' | 'paypal';
    billingPlanId?: string;
    description?: string;
}
export declare class PaymentGatewayService {
    private prisma;
    private xenditSubscription;
    private paypalSubscription;
    private paymentService;
    private readonly logger;
    constructor(prisma: PrismaService, xenditSubscription: XenditSubscriptionService, paypalSubscription: PaypalSubscriptionService, paymentService: PaymentService);
    checkout(input: CheckoutInput): Promise<unknown>;
}
export {};
