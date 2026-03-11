import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { AnalysisResult } from '../types/analysis';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { ComplianceScore } from './ComplianceScore';
import { FindingsSection } from './FindingsSection';

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

          <FindingsSection analysis={analysis} />

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
