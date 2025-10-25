import { SubscriptionService } from './subscription.service';
export declare class SubscriptionScheduler {
    private readonly subscriptionService;
    private readonly logger;
    constructor(subscriptionService: SubscriptionService);
    handleTrialExpiryHMinus1Notifications(): Promise<void>;
    handleAutoExpirePastDue(): Promise<void>;
    handleEnterpriseExpiryHMinus1Notifications(): Promise<void>;
}
