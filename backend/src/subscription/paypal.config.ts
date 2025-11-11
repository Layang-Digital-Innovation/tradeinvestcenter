import * as paypal from 'paypal-rest-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalConfigService {
  constructor(private configService: ConfigService) {
    // Helper untuk membersihkan nilai env (hapus quotes/backticks, komentar inline) dan mode
    const clean = (v?: string) => (v || '')
      .trim()
      .replace(/^['"`]+|['"`]+$/g, '')
      .replace(/\s+#.*$/g, '');
    const cleanMode = (v?: string) => {
      const m = clean(v).toLowerCase();
      return m === 'live' ? 'live' : 'sandbox';
    };

    const mode = cleanMode(this.configService.get<string>('PAYPAL_MODE'));
    const clientId = clean(this.configService.get<string>('PAYPAL_CLIENT_ID'));
    const clientSecret = clean(this.configService.get<string>('PAYPAL_CLIENT_SECRET'));

    // Konfigurasi PayPal SDK
    paypal.configure({
      mode, // 'sandbox' atau 'live'
      client_id: clientId,
      client_secret: clientSecret,
    });
  }

  getPaypalSDK() {
    return paypal;
  }
}