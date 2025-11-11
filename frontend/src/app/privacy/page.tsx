import LegalLayout from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Kebijakan Privasi Trade Invest Center',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="November 11, 2025" updatedLabel="Last updated">
      <h2>Introduction</h2>
      <p>
        This Privacy Policy explains how Trade Invest Center ("TIC") collects, uses, stores,
        and protects your personal data when you use our services.
      </p>

      <h2>Data We Collect</h2>
      <ul>
        <li>Data you provide: name, email, phone number, company information.</li>
        <li>Automatic data: IP address, device type, browser, access logs, cookies.</li>
        <li>Third-party sources: payment providers, analytics services, and verification partners.</li>
      </ul>

      <h2>Purposes of Processing</h2>
      <ul>
        <li>Provide and improve the services, including customer support.</li>
        <li>Process payments, manage subscriptions, and prevent fraud.</li>
        <li>Communicate about products, updates, and important information.</li>
        <li>Usage analytics to improve experience and performance.</li>
      </ul>

      <h2>Legal Basis</h2>
      <p>
        We process data based on consent, contract performance, legitimate interests, and compliance
        with applicable legal obligations.
      </p>

      <h2>Storage & Security</h2>
      <p>
        We apply reasonable technical and organizational measures to protect personal data from unauthorized access,
        loss, or alteration. Data retention is based on operational needs and legal obligations.
      </p>

      <h2>Data Sharing</h2>
      <ul>
        <li>Payment providers (e.g., PayPal/Xendit) to process transactions.</li>
        <li>Analytics, hosting, and security services to support operations.</li>
        <li>When required by law or court order.</li>
      </ul>

      <h2>Your Rights</h2>
      <ul>
        <li>Access, correction, deletion, and data portability (subject to applicable laws).</li>
        <li>Withdraw consent and object to certain processing.</li>
        <li>Lodge a complaint with your local data protection authority.</li>
      </ul>

      <h2>International Transfers</h2>
      <p>
        Data may be processed in other countries with equivalent protections. We ensure lawful transfer mechanisms
        in accordance with applicable regulations.
      </p>

      <h2>Children</h2>
      <p>
        Our services are not intended for children under 18. We do not knowingly collect data from children under that age.
      </p>

      <h2>Policy Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be communicated via the site or your registered email.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related questions, please contact us via the official contact page on the site.
      </p>
    </LegalLayout>
  );
}