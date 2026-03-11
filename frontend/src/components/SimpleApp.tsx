import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { AnalysisResult } from '../types/analysis';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { ComplianceScore } from './ComplianceScore';

function SimpleApp() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeUrl = (inputUrl: string): string => {
    let normalizedUrl = inputUrl.trim();
    normalizedUrl = normalizedUrl.replace(/^https?:\/\//, '');
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    return normalizedUrl;
  };

  const handleAnalyze = async (url: string) => {
    if (!url.trim()) return;

    const normalizedUrl = normalizeUrl(url);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await ApiService.analyzeWebsite(normalizedUrl);
      if (result && typeof result === 'object') {
        setAnalysis(result);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze website';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallScore = (): number => {
    if (!analysis) return 0;
    const securityScore = Math.max(0, 100 - (analysis.security.vulnerabilities.length * 10));
    const privacyScore = (analysis.gdpr.hasCookieBanner && analysis.gdpr.hasPrivacyPolicy) ? 85 : 40;
    const accessibilityScore = Math.max(0, 100 - (analysis.accessibility.missingAltImages * 5));
    return Math.round((securityScore + privacyScore + accessibilityScore) / 3);
  };

  const calculateSecurityScore = (): number => {
    if (!analysis) return 0;
    return Math.max(0, 100 - (analysis.security.vulnerabilities.length * 10));
  };

  const calculatePrivacyScore = (): number => {
    if (!analysis) return 0;
    const baseScore = (analysis.gdpr.hasCookieBanner && analysis.gdpr.hasPrivacyPolicy) ? 85 : 40;
    const trackerPenalty = analysis.gdpr.trackers.filter(t => t.detected).length * 5;
    return Math.max(0, baseScore - trackerPenalty);
  };

  const calculateAccessibilityScore = (): number => {
    if (!analysis) return 0;
    return Math.max(0, 100 - (analysis.accessibility.missingAltImages * 5));
  };

  return (
    <div className="tessera-app">
      <Header />

      {error && (
        <div className="error-banner">
          <div className="container">
            <p className="error-text">⚠️ {error}</p>
          </div>
        </div>
      )}

      {!analysis ? (
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />
      ) : (
        <div className="dashboard-view">
          <ComplianceScore
            overallScore={calculateOverallScore()}
            securityScore={calculateSecurityScore()}
            privacyScore={calculatePrivacyScore()}
            accessibilityScore={calculateAccessibilityScore()}
          />

          <section className="findings-section">
            <div className="container">
              <h2 className="section-title">Detailed Findings</h2>

              {/* Security Findings */}
              <div className="findings-card security-findings">
                <h3 className="findings-title">🔒 Security</h3>
                {analysis.security.vulnerabilities.length > 0 ? (
                  <div className="findings-list">
                    {analysis.security.vulnerabilities.map((vuln, idx) => (
                      <div key={idx} className="finding-item critical">
                        <span className="finding-icon">✗</span>
                        <div className="finding-content">
                          <p className="finding-name">{vuln.component || 'Unknown Component'}</p>
                          <p className="finding-description">{vuln.description}</p>
                          <p className="finding-severity">Severity: {vuln.severity}</p>
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

              {/* Privacy Findings */}
              <div className="findings-card privacy-findings">
                <h3 className="findings-title">👁️ Privacy</h3>
                <div className="findings-list">
                  {!analysis.gdpr.hasCookieBanner && (
                    <div className="finding-item critical">
                      <span className="finding-icon">✗</span>
                      <p className="finding-name">No cookie consent banner detected</p>
                    </div>
                  )}
                  {!analysis.gdpr.hasPrivacyPolicy && (
                    <div className="finding-item critical">
                      <span className="finding-icon">✗</span>
                      <p className="finding-name">No privacy policy found</p>
                    </div>
                  )}
                  {analysis.gdpr.hasCookieBanner && analysis.gdpr.hasPrivacyPolicy && (
                    <div className="finding-item success">
                      <span className="finding-icon">✓</span>
                      <p className="finding-name">GDPR-compliant privacy setup detected</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Accessibility Findings */}
              <div className="findings-card accessibility-findings">
                <h3 className="findings-title">♿ Accessibility</h3>
                {analysis.accessibility.missingAltImages > 0 ? (
                  <div className="finding-item warning">
                    <span className="finding-icon">⚠</span>
                    <p className="finding-name">{analysis.accessibility.missingAltImages} images missing alt text</p>
                  </div>
                ) : (
                  <div className="finding-item success">
                    <span className="finding-icon">✓</span>
                    <p className="finding-name">All images have alt text</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <button
            className="btn btn-secondary btn-large"
            onClick={() => setAnalysis(null)}
            style={{ display: 'block', margin: '40px auto' }}
          >
            Analyze Another Site
          </button>
        </div>
      )}
    </div>
  );
}

export default SimpleApp;
