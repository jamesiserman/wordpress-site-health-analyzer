import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PricingTier {
  name: string;
  subtitle: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    subtitle: 'For small teams',
    price: 'Free',
    billingPeriod: 'forever',
    description: 'Get started with basic compliance checks',
    features: [
      '1 website scan per month',
      'Basic security audit',
      'GDPR checklist',
      'WCAG accessibility report',
      'Email support',
      'Public dashboard link',
    ],
    cta: 'Start Free',
    ctaUrl: '/',
    highlighted: false,
  },
  {
    name: 'Growth',
    subtitle: 'For growing businesses',
    price: '$49',
    billingPeriod: '/month',
    description: 'Comprehensive compliance monitoring',
    features: [
      'Unlimited scans',
      'Advanced security analysis',
      'Full GDPR compliance check',
      'WCAG AAA accessibility audit',
      'Priority email support',
      'Private dashboard',
      'Monthly PDF reports',
      'Vulnerability remediation guides',
      'Slack notifications',
    ],
    cta: 'Start Free Trial',
    ctaUrl: '/',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'For large organizations',
    price: 'Custom',
    billingPeriod: 'contact sales',
    description: 'Advanced features and dedicated support',
    features: [
      'Everything in Growth',
      'Continuous scanning (hourly)',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Team management (unlimited users)',
      'SSO / OAuth integration',
      'SLA guarantee (99.9% uptime)',
      'Advanced compliance reports',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    ctaUrl: '/',
    highlighted: false,
  },
];

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <h1 className="pricing-title">Simple, Transparent Pricing</h1>
          <p className="pricing-subtitle">
            Choose the plan that fits your compliance needs. All plans include core features.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <button
              className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Billing
            </button>
            <button
              className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual Billing
              <span className="discount-badge">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="container">
          <div className="pricing-grid">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
              >
                {tier.highlighted && (
                  <div className="featured-badge">
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="tier-header">
                  <h3 className="tier-name">{tier.name}</h3>
                  <p className="tier-subtitle">{tier.subtitle}</p>
                </div>

                <div className="tier-pricing">
                  <span className="price">{tier.price}</span>
                  {tier.billingPeriod !== 'contact sales' && (
                    <span className="period">{tier.billingPeriod}</span>
                  )}
                  <p className="tier-description">{tier.description}</p>
                </div>

                <button className="cta-button" style={{
                  background: tier.highlighted ? 'var(--gradient-primary)' : 'white',
                  color: tier.highlighted ? 'white' : 'var(--color-navy)',
                  border: tier.highlighted ? 'none' : '2px solid var(--color-cobalt)',
                }}>
                  {tier.cta}
                </button>

                <div className="features-divider"></div>

                <ul className="features-list">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h4 className="faq-question">Can I change plans anytime?</h4>
              <p className="faq-answer">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">What payment methods do you accept?</h4>
              <p className="faq-answer">
                We accept all major credit cards (Visa, Mastercard, American Express) and can arrange annual invoicing for Enterprise customers.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">Is there a free trial?</h4>
              <p className="faq-answer">
                Yes! Growth and Enterprise plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">Do you offer discounts for annual billing?</h4>
              <p className="faq-answer">
                Yes! Annual plans receive a 20% discount. Contact our sales team for Enterprise custom pricing.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">Can I export my scan reports?</h4>
              <p className="faq-answer">
                Growth and Enterprise plans can export detailed compliance reports as PDF. API access is available for Enterprise.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">What about refunds?</h4>
              <p className="faq-answer">
                We offer a 30-day money-back guarantee if you're not satisfied with Tessera. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pricing-cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to improve your compliance?</h2>
            <p>Start your free scan today. No credit card required.</p>
            <Link to="/" className="btn btn-primary btn-large">
              Scan Your Site Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
