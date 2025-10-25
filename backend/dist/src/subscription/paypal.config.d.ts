import * as paypal from 'paypal-rest-sdk';
import { ConfigService } from '@nestjs/config';
export declare class PaypalConfigService {
    private configService;
    constructor(configService: ConfigService);
    getPaypalSDK(): typeof paypal;
}
