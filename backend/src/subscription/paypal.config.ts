import * as paypal from 'paypal-rest-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalConfigService {
  constructor(private configService: ConfigService) {
    // Konfigurasi PayPal SDK
    paypal.configure({
      mode: this.configService.get<string>('PAYPAL_MODE') || 'sandbox', // sandbox atau live
      client_id: this.configService.get<string>('PAYPAL_CLIENT_ID') || '',
      client_secret: this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '',
    });
  }

  getPaypalSDK() {
    return paypal;
  }
}