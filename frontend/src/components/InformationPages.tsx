import React from 'react';
import { Link } from 'react-router-dom';

interface InfoPageProps {
  pageType: 'security' | 'privacy' | 'accessibility' | 'docs';
}

export function InformationPages({ pageType }: InfoPageProps) {
  const getPageContent = () => {
    switch (pageType) {
      case 'security':
        return {
          title: 'Security Standards & Best Practices',
          subtitle: 'Understanding web application security vulnerabilities and remediation',
          icon: '🔒',
          sections: [
            {
              heading: 'OWASP Top 10',
              content: 'The Open Worldwide Application Security Project (OWASP) Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications.',
              items: [
                'Broken Access Control',
                'Cryptographic Failures',
                'Injection',
                'Insecure Design',
                'Security Misconfiguration',
                'Vulnerable and Outdated Components',
                'Authentication Failures',
                'Software and Data Integrity Failures',
                'Logging and Monitoring Failures',
                'Server-Side Request Forgery (SSRF)',
              ],
            },
            {
              heading: 'Common Vulnerabilities',
              content: 'Tessera scans for and identifies these critical security issues:',
              items: [
                'SSL/TLS Certificate Issues - Expired or improperly configured certificates',
                'Missing Security Headers - CSP, HSTS, X-Frame-Options not configured',
                'Outdated Libraries & Dependencies - Known vulnerabilities in third-party code',
                'Weak Password Policies - Insufficient authentication mechanisms',
                'Insecure Data Transmission - Unencrypted sensitive data',
              ],
            },
            {
              heading: 'Security Headers',
              content: 'Essential HTTP security headers that should be implemented:',
              items: [
                'Content-Security-Policy - Prevents XSS and injection attacks',
                'Strict-Transport-Security - Enforces HTTPS connections',
                'X-Frame-Options - Prevents clickjacking attacks',
                'X-Content-Type-Options - Prevents MIME type sniffing',
                'Referrer-Policy - Controls referrer information',
              ],
            },
          ],
        };

      case 'privacy':
        return {
          title: 'Privacy & GDPR Compliance',
          subtitle: 'Ensuring your website meets privacy regulations and data protection standards',
          icon: '👁️',
          sections: [
            {
              heading: 'GDPR Requirements',
              content: 'The General Data Protection Regulation (GDPR) is a legal framework that sets guidelines for the collection and processing of personal information. Key requirements include:',
              items: [
                'Privacy Policy - Clear, accessible disclosure of data practices',
                'Cookie Consent - Explicit consent before tracking cookies',
                'Data Subject Rights - Users can access, modify, or delete their data',
                'Data Processing Agreement - Documented agreements with processors',
                'Privacy Impact Assessments - Evaluation of data processing risks',
              ],
            },
            {
              heading: 'Cookie Management',
              content: 'Implementing compliant cookie consent:',
              items: [
                'Cookie Consent Banner - Must appear before non-essential cookies are set',
                'Granular Consent - Users choose which types of cookies to allow',
                'Clear Cookie Policy - Document all cookies and their purposes',
                'Easy Opt-Out - Users can withdraw consent at any time',
                'First-Party vs Third-Party - Understand cookie ownership and risks',
              ],
            },
            {
              heading: 'Privacy Best Practices',
              content: 'Recommended practices for protecting user privacy:',
              items: [
                'Data Minimization - Collect only necessary data',
                'Encryption - Protect data in transit and at rest',
                'Access Controls - Limit data access to authorized personnel',
                'Regular Audits - Monitor data handling practices',
                'Incident Response - Plan for potential data breaches',
              ],
            },
          ],
        };

      case 'accessibility':
        return {
          title: 'Accessibility & WCAG Standards',
          subtitle: 'Making your website accessible to all users, including those with disabilities',
          icon: '♿',
          sections: [
            {
              heading: 'WCAG 2.1 Levels',
              content: 'The Web Content Accessibility Guidelines (WCAG) define three conformance levels:',
              items: [
                'Level A - Basic accessibility compliance, foundational standards',
                'Level AA - Enhanced accessibility, addresses most common barriers',
                'Level AAA - Advanced accessibility, highest level of compliance',
              ],
            },
            {
              heading: 'Core Accessibility Principles (POUR)',
              content: 'WCAG is organized around four principles:',
              items: [
                'Perceivable - Content must be presentable to users in ways they can perceive',
                'Operable - Interface must be operable via keyboard and other methods',
                'Understandable - Content and interface must be clear and predictable',
                'Robust - Content must be compatible with various assistive technologies',
              ],
            },
            {
              heading: 'Common Issues & Fixes',
              content: 'Frequent accessibility problems and their solutions:',
              items: [
                'Missing Alt Text - Provide descriptive text for all images',
                'Poor Color Contrast - Ensure text meets contrast ratios (4.5:1 for AA)',
                'Missing Heading Structure - Use H1-H6 tags in logical order',
                'Keyboard Navigation - Ensure all functionality is keyboard accessible',
                'Form Labels - Associate labels with form inputs using <label> tags',
                'Skip Links - Provide way to skip repetitive content',
                'ARIA Attributes - Use aria-label, aria-describedby for complex elements',
              ],
            },
          ],
        };

      case 'docs':
        return {
          title: 'Documentation & Resources',
          subtitle: 'Getting started guides, API documentation, and support resources',
          icon: '📚',
          sections: [
            {
              heading: 'Getting Started',
              content: 'Start using Tessera in minutes:',
              items: [
                'Visit inspect-my-site.com and sign up for a free account',
                'Enter your website URL in the dashboard',
                'Tessera will scan your site in 30-60 seconds',
                'Review your compliance score and findings',
                'Download your report or set up automated scanning',
              ],
            },
            {
              heading: 'Understanding Your Reports',
              content: 'Each Tessera scan generates a comprehensive report showing:',
              items: [
                'Overall Compliance Score - 0-100% across all standards',
                'Category Scores - Separate scores for Security, Privacy, and Accessibility',
                'Detailed Findings - Specific vulnerabilities with severity levels',
                'Remediation Guidance - Actionable steps to fix each issue',
                'Compliance Timeline - Track improvements over time',
              ],
            },
            {
              heading: 'API Documentation',
              content: 'For Growth and Enterprise plans:',
              items: [
                'RESTful API - Access scan results programmatically',
                'Webhook Support - Real-time notifications of scan completion',
                'Custom Integrations - Connect Tessera to your tools and workflows',
                'Rate Limits - 1,000 requests/hour for standard plans',
                'Authentication - API keys for secure access',
              ],
            },
            {
              heading: 'Support & Help',
              content: 'Get help when you need it:',
              items: [
                'Knowledge Base - 50+ articles covering common questions',
                'Email Support - Response within 24 hours (Growth) or 1 hour (Enterprise)',
                'Live Chat - Available during business hours',
                'Community Forum - Share questions with other Tessera users',
                'Status Page - Check system status and planned maintenance',
              ],
            },
          ],
        };

      default:
        return {
          title: 'Information',
          subtitle: '',
          icon: '📖',
          sections: [],
        };
    }
  };

  const content = getPageContent();

  return (
    <div className="info-page">
      {/* Hero Section */}
      <section className="info-hero">
        <div className="container">
          <div className="info-hero-icon">{content.icon}</div>
          <h1 className="info-title">{content.title}</h1>
          <p className="info-subtitle">{content.subtitle}</p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="info-content">
        <div className="container">
          {content.sections.map((section, idx) => (
            <div key={idx} className="info-section">
              <h2 className="section-heading">{section.heading}</h2>
              <p className="section-description">{section.content}</p>

              <ul className="info-list">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="info-list-item">
                    <span className="list-icon">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="info-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to improve your {pageType === 'security' ? 'security' : pageType === 'privacy' ? 'privacy compliance' : pageType === 'accessibility' ? 'accessibility' : 'compliance'}?</h2>
            <p>Scan your website and get a detailed compliance report.</p>
            <Link to="/" className="btn btn-primary btn-large">
              Start Your Free Scan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
