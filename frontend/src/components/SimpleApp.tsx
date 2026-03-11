import React, { useState, useEffect, useRef } from 'react';
import { ApiService } from '../services/api';
import { AnalysisResult } from '../types/analysis';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { ComplianceScore } from './ComplianceScore';
import { FindingsSection } from './FindingsSection';
import { Recommendations } from './Recommendations';
import { AnalysisSummary } from './AnalysisSummary';
import { initializeAnalytics, trackScanInitiated, trackScanCompleted } from '../utils/analytics';

function SimpleApp() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Scroll to dashboard when analysis loads
  useEffect(() => {
    if (analysis && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);

  const normalizeUrl = (inputUrl: string): string => {
    let normalized = inputUrl.trim();
    normalized = normalized.replace(/^https?:\/\//, '');
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }
    return normalized;
  };

  const handleAnalyze = async (url: string) => {
    if (!url.trim()) return;

    const normalizedUrl = normalizeUrl(url);
    const startTime = Date.now();

    trackScanInitiated(normalizedUrl);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await ApiService.analyzeWebsite(normalizedUrl);
      if (result && typeof result === 'object') {
        setAnalysis(result);
        const duration = (Date.now() - startTime) / 1000;
        trackScanCompleted(normalizedUrl, result.overallScore, duration);
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
    const sec = Math.max(0, 100 - (analysis.security.vulnerabilities.length * 10));
    const priv = (analysis.gdpr.hasCookieBanner && analysis.gdpr.hasPrivacyPolicy) ? 85 : 40;
    const a11y = Math.max(0, 100 - (analysis.accessibility.missingAltImages * 5));
    return Math.round((sec + priv + a11y) / 3);
  };

  const calculateSecurityScore = (): number => {
    if (!analysis) return 0;
    return Math.max(0, 100 - (analysis.security.vulnerabilities.length * 10));
  };

  const calculatePrivacyScore = (): number => {
    if (!analysis) return 0;
    const base = (analysis.gdpr.hasCookieBanner && analysis.gdpr.hasPrivacyPolicy) ? 85 : 40;
    const penalty = analysis.gdpr.trackers.filter(t => t.detected).length * 5;
    return Math.max(0, base - penalty);
  };

  const calculateAccessibilityScore = (): number => {
    if (!analysis) return 0;
    return Math.max(0, 100 - (analysis.accessibility.missingAltImages * 5));
  };

  const handleScanClick = () => {
    if (analysis) {
      setAnalysis(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="tessera-app">
      <Header onScanClick={handleScanClick} />

      {error && (
        <div className="error-banner" role="alert">
          <div className="container">
            <span aria-hidden="true">⚠</span>
            <p className="error-text">{error}</p>
          </div>
        </div>
      )}

      {!analysis ? (
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />
      ) : (
        <main id="main-content" className="dashboard-view" ref={dashboardRef}>
          <AnalysisSummary analysis={analysis} />

          <ComplianceScore
            overallScore={calculateOverallScore()}
            securityScore={calculateSecurityScore()}
            privacyScore={calculatePrivacyScore()}
            accessibilityScore={calculateAccessibilityScore()}
          />

          <FindingsSection analysis={analysis} />

          <Recommendations recommendations={analysis.recommendations} />

          <div style={{ textAlign: 'center', padding: '48px 0 64px' }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setAnalysis(null)}
            >
              Scan Another Website
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default SimpleApp;
