import LegalLayout from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Disclaimer',
  description: 'Penafian Trade Invest Center',
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" updatedAt="November 11, 2025" updatedLabel="Last updated">
      <h2>Introduction</h2>
      <p>
        This Disclaimer outlines the limitations of liability and the nature of information provided by Trade Invest Center ("TIC").
      </p>

      <h2>Not Financial/Investment Advice</h2>
      <p>
        Information available through TIC’s services is general in nature and is not intended as financial, investment, legal, or tax advice.
        Investment decisions are entirely your responsibility.
      </p>

      <h2>Market Risks</h2>
      <p>
        Investment and trading activities carry significant market risks. Asset values may fluctuate, and you may lose part or all of your capital.
        Conduct your own research before taking action.
      </p>

      <h2>Accuracy & Availability of Information</h2>
      <p>
        We strive to provide accurate and up-to-date information, but we do not guarantee completeness, accuracy, or availability at all times.
        Content may change without notice.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our services may include links to third-party sites. We are not responsible for the content, policies, or practices of those sites.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the extent permitted by law, TIC shall not be liable for indirect, incidental, special, consequential, or loss of profits arising from the use of the services.
      </p>

      <h2>Contact</h2>
      <p>
        For questions related to this disclaimer, please contact us via the official contact page on the site.
      </p>
    </LegalLayout>
  );
}