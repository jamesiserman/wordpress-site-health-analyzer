import React from 'react';
import { AnalysisResult } from '../types/analysis';

interface FindingsSectionProps {
  analysis: AnalysisResult;
}

export function FindingsSection({ analysis }: FindingsSectionProps) {
  const getSeverityBadgeClass = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'badge-critical';
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const getSeverityLabel = (severity: string): string => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <section className="findings-section">
      <div className="container">
        <h2 className="section-title">Detailed Findings</h2>

        {/* Security Findings */}
        <div className="findings-card security-findings">
          <div className="findings-header">
            <h3 className="findings-title">🔒 Security</h3>
            <span className={`score-badge ${analysis.security.score >= 80 ? 'badge-good' : analysis.security.score >= 60 ? 'badge-warning' : 'badge-critical'}`}>
              {analysis.security.score}%
            </span>
          </div>

          {/* Vulnerabilities */}
          <div className="findings-subsection">
            <h4 className="subsection-title">
              Vulnerabilities ({analysis.security.vulnerabilities.length})
            </h4>
            {analysis.security.vulnerabilities.length > 0 ? (
              <div className="findings-list">
                {analysis.security.vulnerabilities.map((vuln, idx) => (
                  <div key={`vuln-${idx}`} className="finding-item critical">
                    <div className="finding-icon-wrapper">
                      <span className="finding-icon">✗</span>
                    </div>
                    <div className="finding-content">
                      <div className="finding-header-row">
                        <p className="finding-name">{vuln.component || 'Unknown Component'}</p>
                        <span className={`severity-badge ${getSeverityBadgeClass(vuln.severity)}`}>
                          {getSeverityLabel(vuln.severity)}
                        </span>
                      </div>
                      {vuln.version && (
                        <p className="finding-version">Version: {vuln.version}</p>
                      )}
                      <p className="finding-description">{vuln.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="finding-item success">
                <span className="finding-icon">✓</span>
                <p className="finding-name">No known vulnerabilities detected</p>
              </div>
            )}
          </div>

          {/* SSL Certificate */}
          <div className="findings-subsection">
            <h4 className="subsection-title">SSL Certificate</h4>
            <div className="finding-item" style={{ padding: '12px' }}>
              {analysis.security.sslCertificate.isValid ? (
                <>
                  <span className="finding-icon" style={{ color: 'var(--color-emerald)' }}>✓</span>
                  <div className="finding-content">
                    <p className="finding-name">Valid SSL Certificate</p>
                    {analysis.security.sslCertificate.issuer && (
                      <p className="finding-description">Issuer: {analysis.security.sslCertificate.issuer}</p>
                    )}
                    {analysis.security.sslCertificate.expiryDate && (
                      <p className="finding-description">Expires: {analysis.security.sslCertificate.expiryDate}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="finding-icon" style={{ color: 'var(--color-crimson)' }}>✗</span>
                  <p className="finding-name">Invalid or missing SSL Certificate</p>
                </>
              )}
            </div>
          </div>

          {/* Security Headers */}
          <div className="findings-subsection">
            <h4 className="subsection-title">Security Headers</h4>
            <div className="security-headers-grid">
              <HeaderCheck label="Content-Security-Policy" present={analysis.security.securityHeaders.contentSecurityPolicy} />
              <HeaderCheck label="Strict-Transport-Security" present={analysis.security.securityHeaders.strictTransportSecurity} />
              <HeaderCheck label="X-Frame-Options" present={analysis.security.securityHeaders.xFrameOptions} />
              <HeaderCheck label="X-Content-Type-Options" present={analysis.security.securityHeaders.xContentTypeOptions} />
              <HeaderCheck label="Referrer-Policy" present={analysis.security.securityHeaders.referrerPolicy} />
              <HeaderCheck label="Permissions-Policy" present={analysis.security.securityHeaders.permissionsPolicy} />
            </div>
          </div>
        </div>

        {/* Privacy Findings */}
        <div className="findings-card privacy-findings">
          <div className="findings-header">
            <h3 className="findings-title">👁️ Privacy & GDPR</h3>
            <span className={`score-badge ${analysis.gdpr.score >= 80 ? 'badge-good' : analysis.gdpr.score >= 60 ? 'badge-warning' : 'badge-critical'}`}>
              {analysis.gdpr.score}%
            </span>
          </div>

          {/* GDPR Compliance */}
          <div className="findings-subsection">
            <h4 className="subsection-title">Compliance Status</h4>
            <div className="findings-list">
              <div className={`finding-item ${analysis.gdpr.hasCookieBanner ? 'success' : 'critical'}`}>
                <span className="finding-icon">{analysis.gdpr.hasCookieBanner ? '✓' : '✗'}</span>
                <p className="finding-name">Cookie Consent Banner</p>
              </div>
              <div className={`finding-item ${analysis.gdpr.hasPrivacyPolicy ? 'success' : 'critical'}`}>
                <span className="finding-icon">{analysis.gdpr.hasPrivacyPolicy ? '✓' : '✗'}</span>
                <p className="finding-name">Privacy Policy</p>
              </div>
            </div>
          </div>

          {/* Trackers */}
          {analysis.gdpr.trackers && analysis.gdpr.trackers.length > 0 && (
            <div className="findings-subsection">
              <h4 className="subsection-title">
                Trackers Detected ({analysis.gdpr.trackers.filter(t => t.detected).length})
              </h4>
              <div className="findings-list">
                {analysis.gdpr.trackers.map((tracker, idx) => (
                  tracker.detected && (
                    <div key={`tracker-${idx}`} className="finding-item warning">
                      <span className="finding-icon">⚠</span>
                      <div className="finding-content">
                        <p className="finding-name">{tracker.name}</p>
                        <p className="finding-description">Type: {tracker.type}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accessibility Findings */}
        <div className="findings-card accessibility-findings">
          <div className="findings-header">
            <h3 className="findings-title">♿ Accessibility</h3>
            <span className={`score-badge ${analysis.accessibility.score >= 80 ? 'badge-good' : analysis.accessibility.score >= 60 ? 'badge-warning' : 'badge-critical'}`}>
              {analysis.accessibility.score}%
            </span>
          </div>

          {/* Alt Text Issues */}
          <div className="findings-subsection">
            <h4 className="subsection-title">Images</h4>
            <div className="finding-item" style={{ padding: '12px' }}>
              {analysis.accessibility.missingAltImages > 0 ? (
                <>
                  <span className="finding-icon" style={{ color: 'var(--color-amber)' }}>⚠</span>
                  <div className="finding-content">
                    <p className="finding-name">{analysis.accessibility.missingAltImages} images missing alt text</p>
                    <p className="finding-description">Add descriptive alt text to all images for screen reader users</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="finding-icon" style={{ color: 'var(--color-emerald)' }}>✓</span>
                  <p className="finding-name">All images have alt text</p>
                </>
              )}
            </div>
          </div>

          {/* Heading Structure */}
          {analysis.accessibility.headingIssues && analysis.accessibility.headingIssues.length > 0 && (
            <div className="findings-subsection">
              <h4 className="subsection-title">Heading Structure</h4>
              <div className="findings-list">
                {analysis.accessibility.headingIssues.map((issue, idx) => (
                  <div key={`heading-${idx}`} className="finding-item warning">
                    <span className="finding-icon">⚠</span>
                    <p className="finding-description">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARIA Labels */}
          <div className="findings-subsection">
            <h4 className="subsection-title">ARIA Labels</h4>
            <div className="finding-item" style={{ padding: '12px' }}>
              {analysis.accessibility.missingAriaLabels > 0 ? (
                <>
                  <span className="finding-icon" style={{ color: 'var(--color-amber)' }}>⚠</span>
                  <div className="finding-content">
                    <p className="finding-name">{analysis.accessibility.missingAriaLabels} interactive elements missing ARIA labels</p>
                    <p className="finding-description">Add aria-label or aria-labelledby to interactive components</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="finding-icon" style={{ color: 'var(--color-emerald)' }}>✓</span>
                  <p className="finding-name">Sufficient ARIA labels detected</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeaderCheck({ label, present }: { label: string; present: boolean }) {
  return (
    <div className="header-check">
      <span className={`check-icon ${present ? 'present' : 'missing'}`}>
        {present ? '✓' : '✗'}
      </span>
      <span className="check-label">{label}</span>
    </div>
  );
}
