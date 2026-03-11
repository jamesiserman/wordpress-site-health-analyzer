import React, { useState, FormEvent, useRef } from 'react';
import { Footer } from './Footer';

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [url, setUrl] = useState('');
  const formRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  const scrollToForm = () => {
    formRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="main-content">
      {/* ────────── HERO ────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-eyebrow" aria-hidden="true">
                <span>Website Compliance Platform</span>
              </div>

              <h1 id="hero-heading">
                Turn Compliance Risk Into Visible&nbsp;Confidence
              </h1>

              <p className="hero-lead">
                Scan your website for security vulnerabilities, GDPR privacy gaps,
                and WCAG accessibility issues — in 60 seconds. Get a prioritized
                action plan, not a wall of jargon.
              </p>

              <form className="hero-form" onSubmit={handleSubmit} aria-label="Scan your website">
                <div className="input-group">
                  <input
                    ref={formRef}
                    type="text"
                    placeholder="yoursite.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    aria-label="Website URL"
                    autoComplete="url"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Scanning\u2026' : 'Scan My Site Free'}
                  </button>
                </div>
              </form>

              <div className="hero-proof" aria-label="Benefits">
                <span><span className="check" aria-hidden="true">✓</span> No credit card</span>
                <span><span className="check" aria-hidden="true">✓</span> 60-second scan</span>
                <span><span className="check" aria-hidden="true">✓</span> Full compliance report</span>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-mockup">
                <div className="mockup-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mockup-body">
                  <div className="mockup-score">84%</div>
                  <div className="mockup-bars">
                    <div className="mockup-bar"><div className="mockup-bar-fill"></div></div>
                    <div className="mockup-bar"><div className="mockup-bar-fill"></div></div>
                    <div className="mockup-bar"><div className="mockup-bar-fill"></div></div>
                  </div>
                  <div className="mockup-labels">
                    <span>Security</span><span>Privacy</span><span>Accessibility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── PROBLEM ────────── */}
      <section className="section problem-section" aria-labelledby="problem-heading">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">The Hidden Problem</p>
            <h2 id="problem-heading">Most Websites Fail Compliance — Without Knowing It</h2>
            <p>
              Security breaches cost an average of $4.45M. GDPR fines reach 4% of
              annual revenue. And 97% of home pages have WCAG failures. These
              risks are invisible until it's too late.
            </p>
          </div>

          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon" role="img" aria-label="Security risk">
                <span aria-hidden="true">🔓</span>
              </div>
              <h4>Security Gaps Go Unnoticed</h4>
              <p>
                Missing security headers, expired SSL certificates, and
                known CVEs in your dependencies — attackers scan for
                these automatically. You should too.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon" role="img" aria-label="Privacy risk">
                <span aria-hidden="true">📋</span>
              </div>
              <h4>Privacy Violations Trigger Fines</h4>
              <p>
                No cookie consent? Trackers loading before opt-in? Missing
                privacy policy? GDPR regulators are issuing record
                penalties, and small businesses aren't exempt.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon" role="img" aria-label="Accessibility risk">
                <span aria-hidden="true">🚫</span>
              </div>
              <h4>Inaccessible Sites Exclude Users</h4>
              <p>
                Missing alt text, broken heading hierarchy, and missing
                ARIA labels shut out users who rely on screen readers —
                and expose you to legal action under ADA and EAA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── FEATURES ────────── */}
      <section className="section features-section" id="features" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">What Tessera Checks</p>
            <h2 id="features-heading">Three Standards. One Scan. Complete Clarity.</h2>
            <p>
              Every scan audits your website against real-world security,
              privacy, and accessibility benchmarks — then tells you
              exactly what to fix first.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">🔒</div>
              <h4>SSL &amp; Certificate Validation</h4>
              <p>Verify your SSL certificate is valid, properly configured, and not approaching expiry.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">🛡️</div>
              <h4>Security Header Analysis</h4>
              <p>Check for CSP, HSTS, X-Frame-Options, and four other critical HTTP headers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">⚠️</div>
              <h4>Vulnerability Detection</h4>
              <p>Identify known CVEs in your technology stack with severity ratings and remediation steps.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">🍪</div>
              <h4>Cookie Consent &amp; GDPR</h4>
              <p>Detect missing cookie banners, privacy policies, and third-party trackers loading without consent.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">👁️</div>
              <h4>Tracker &amp; Data Flow Audit</h4>
              <p>Map every analytics, advertising, and social tracker embedded in your pages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">♿</div>
              <h4>WCAG Accessibility Scan</h4>
              <p>Audit alt text, heading structure, ARIA labels, and color contrast against WCAG 2.1 Level AA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── HOW IT WORKS ────────── */}
      <section className="section how-section" id="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">How It Works</p>
            <h2 id="how-heading">From URL to Action Plan in 60 Seconds</h2>
            <p>
              No account required. No installation. Paste your URL and get
              a complete compliance report immediately.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Enter Your URL</h4>
              <p>
                Type or paste any website address. Tessera works with any
                platform — WordPress, Shopify, custom builds, SPAs.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Automated Analysis</h4>
              <p>
                Tessera audits security headers, SSL, GDPR compliance,
                trackers, and WCAG accessibility in a single pass.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Prioritized Report</h4>
              <p>
                Get a compliance score, severity-ranked findings, and
                step-by-step remediation guidance — not a data dump.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── TRUST / SOCIAL PROOF ────────── */}
      <section className="section trust-section" aria-labelledby="trust-heading">
        <div className="container">
          <h2 id="trust-heading" className="sr-only">Trusted by teams worldwide</h2>
          <div className="trust-stats">
            <div>
              <div className="trust-stat-number">12,000+</div>
              <div className="trust-stat-label">Websites Scanned</div>
            </div>
            <div>
              <div className="trust-stat-number">340K+</div>
              <div className="trust-stat-label">Issues Identified</div>
            </div>
            <div>
              <div className="trust-stat-number">60s</div>
              <div className="trust-stat-label">Average Scan Time</div>
            </div>
            <div>
              <div className="trust-stat-number">3</div>
              <div className="trust-stat-label">Standards Covered</div>
            </div>
          </div>

          <div className="trust-logos">
            <span>OWASP</span>
            <span>GDPR</span>
            <span>WCAG 2.1</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </section>

      {/* ────────── BOTTOM CTA ────────── */}
      <section className="section cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-box">
            <h2 id="cta-heading">Your Compliance Blindspots End Here</h2>
            <p>
              Run your first scan free. No account, no credit card, no strings.
              See exactly where your website stands in 60 seconds.
            </p>
            <button className="btn btn-primary btn-lg" onClick={scrollToForm}>
              Scan My Site Free
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
