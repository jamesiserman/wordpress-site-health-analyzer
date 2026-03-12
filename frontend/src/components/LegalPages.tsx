import React from 'react';
import { Link } from 'react-router-dom';

interface LegalPageProps {
  pageType: 'terms' | 'privacy-policy';
}

export function LegalPages({ pageType }: LegalPageProps) {
  const content = pageType === 'terms' ? termsContent : privacyContent;

  return (
    <div className="info-page">
      <section className="info-hero">
        <div className="container">
          <h1 className="info-title">{content.title}</h1>
          <p className="info-subtitle">Last updated: March 11, 2026</p>
        </div>
      </section>

      <section className="info-content">
        <div className="container">
          {content.sections.map((section, idx) => (
            <div key={idx} className="info-section">
              <h2 className="section-heading">{section.heading}</h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="section-description">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="info-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Questions about our policies?</h2>
            <p>Contact us at support@inspect-my-site.com</p>
            <Link to="/" className="btn btn-primary btn-large">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const termsContent = {
  title: 'Terms of Service',
  sections: [
    {
      heading: '1. Agreement to Terms',
      paragraphs: [
        'By accessing or using the Tessera website compliance monitoring service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.',
        'These Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 18 years of age.',
      ],
    },
    {
      heading: '2. Description of Service',
      paragraphs: [
        'Tessera provides automated website compliance scanning and reporting services covering security, privacy (GDPR), and accessibility (WCAG) standards. The Service analyzes publicly accessible web pages and generates compliance reports based on automated checks.',
        'Tessera reports are informational tools and do not constitute legal advice, certification, or guaranteed compliance with any specific regulation or standard.',
      ],
    },
    {
      heading: '3. User Accounts',
      paragraphs: [
        'Free scans do not require an account. Paid plans require account registration with accurate and complete information. You are responsible for maintaining the security of your account credentials and for all activities under your account.',
      ],
    },
    {
      heading: '4. Acceptable Use',
      paragraphs: [
        'You agree to use the Service only for lawful purposes. You may only scan websites that you own or have explicit authorization to scan. You may not use the Service to: (a) scan websites without authorization; (b) attempt to exploit or disrupt the Service; (c) use scan results to harm third parties; (d) exceed rate limits or abuse the Service infrastructure.',
      ],
    },
    {
      heading: '5. Intellectual Property',
      paragraphs: [
        'The Service, including its design, code, content, logos, and trademarks, is owned by Tessera and protected by intellectual property laws. Your compliance reports and scan data belong to you. You grant Tessera a limited license to process your data as necessary to provide the Service.',
      ],
    },
    {
      heading: '6. Payment Terms',
      paragraphs: [
        'Paid plans are billed monthly or annually as selected at signup. Prices are in USD and exclude applicable taxes. You may cancel at any time; cancellation takes effect at the end of the current billing period. Refunds are available within 30 days of initial purchase.',
      ],
    },
    {
      heading: '7. Limitation of Liability',
      paragraphs: [
        'The Service is provided "as is" without warranties of any kind. Tessera does not guarantee that scan results are complete, accurate, or current. Tessera\'s total liability to you for any claim arising from or related to the Service is limited to the amount you paid in the 12 months preceding the claim.',
        'Tessera is not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or business opportunities.',
      ],
    },
    {
      heading: '8. Privacy',
      paragraphs: [
        'Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in the Privacy Policy.',
      ],
    },
    {
      heading: '9. Changes to Terms',
      paragraphs: [
        'We may update these Terms from time to time. Material changes will be communicated via email or prominent notice on the Service. Continued use after changes constitutes acceptance of the updated Terms.',
      ],
    },
    {
      heading: '10. Contact',
      paragraphs: [
        'For questions about these Terms, contact us at legal@inspect-my-site.com.',
      ],
    },
  ],
};

const privacyContent = {
  title: 'Privacy Policy',
  sections: [
    {
      heading: '1. Introduction',
      paragraphs: [
        'Tessera ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website compliance monitoring service.',
        'This policy applies to information collected through our website, service, and related communications.',
      ],
    },
    {
      heading: '2. Information We Collect',
      paragraphs: [
        'Account Information: When you create an account, we collect your email address, name, and payment information (processed securely by our payment provider).',
        'Scan Data: When you scan a website, we collect the URL submitted and the scan results. We only analyze publicly accessible web pages.',
        'Usage Data: We collect information about how you interact with the Service, including pages visited, features used, and scan frequency. This data is collected via Google Analytics 4 and is anonymized.',
        'Technical Data: We automatically collect your IP address, browser type, operating system, and device information for security and service improvement purposes.',
      ],
    },
    {
      heading: '3. How We Use Your Information',
      paragraphs: [
        'We use collected information to: (a) provide and maintain the Service; (b) generate compliance reports; (c) communicate with you about your account and the Service; (d) improve the Service and develop new features; (e) detect and prevent fraud or abuse; (f) comply with legal obligations.',
      ],
    },
    {
      heading: '4. Data Sharing',
      paragraphs: [
        'We do not sell your personal information. We may share information with: (a) service providers who help us operate the Service (hosting, analytics, payment processing); (b) law enforcement when required by law; (c) other parties with your explicit consent.',
        'All service providers are bound by data processing agreements and are required to protect your information.',
      ],
    },
    {
      heading: '5. Data Retention',
      paragraphs: [
        'Account data is retained while your account is active and for 30 days after deletion. Scan results are retained for 12 months on paid plans. Free scan results are retained for 30 days. You may request deletion of your data at any time.',
      ],
    },
    {
      heading: '6. Your Rights (GDPR)',
      paragraphs: [
        'If you are in the European Economic Area, you have the right to: (a) access your personal data; (b) rectify inaccurate data; (c) request erasure of your data; (d) restrict processing; (e) data portability; (f) object to processing; (g) withdraw consent at any time.',
        'To exercise these rights, contact us at privacy@inspect-my-site.com. We will respond within 30 days.',
      ],
    },
    {
      heading: '7. Cookies',
      paragraphs: [
        'We use essential cookies required for the Service to function. Analytics cookies (Google Analytics 4) are only loaded after consent. You can manage cookie preferences at any time through the cookie consent banner.',
        'Essential cookies: Session management, security tokens. Analytics cookies: Page views, feature usage (anonymized). We do not use advertising or tracking cookies.',
      ],
    },
    {
      heading: '8. Security',
      paragraphs: [
        'We implement industry-standard security measures including HTTPS encryption, secure credential storage, access controls, and regular security audits. Despite these measures, no method of transmission or storage is 100% secure.',
      ],
    },
    {
      heading: '9. International Transfers',
      paragraphs: [
        'Our Service is hosted on Cloudflare infrastructure. Data may be processed in the EU, US, or other jurisdictions where Cloudflare operates. We ensure adequate safeguards are in place for international data transfers in compliance with GDPR.',
      ],
    },
    {
      heading: '10. Children\'s Privacy',
      paragraphs: [
        'The Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.',
      ],
    },
    {
      heading: '11. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. Material changes will be communicated via email or prominent notice on the Service at least 30 days before they take effect.',
      ],
    },
    {
      heading: '12. Contact Us',
      paragraphs: [
        'For privacy-related inquiries: privacy@inspect-my-site.com. Data Protection Officer: dpo@inspect-my-site.com. Postal address: Tessera, [Address to be added].',
      ],
    },
  ],
};
