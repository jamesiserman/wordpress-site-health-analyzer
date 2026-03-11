import React from 'react';
import { AnalysisResult } from '../types/analysis';

interface AnalysisSummaryProps {
  analysis: AnalysisResult;
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (score: number): string => {
    if (score >= 80) return '✨';
    if (score >= 60) return '⚠️';
    return '🚨';
  };

  const countIssues = (): { critical: number; warning: number; low: number } => {
    let critical = 0;
    let warning = 0;
    let low = 0;

    analysis.security.vulnerabilities.forEach((v) => {
      if (v.severity === 'critical' || v.severity === 'high') {
        critical++;
      } else if (v.severity === 'medium') {
        warning++;
      } else {
        low++;
      }
    });

    if (!analysis.gdpr.hasCookieBanner || !analysis.gdpr.hasPrivacyPolicy) {
      critical += 2;
    }

    if (analysis.accessibility.missingAltImages > 0) {
      warning++;
    }

    if (analysis.accessibility.missingAriaLabels > 0) {
      warning++;
    }

    return { critical, warning, low };
  };

  const issues = countIssues();

  return (
    <section className="analysis-summary">
      <div className="container">
        <div className="summary-header">
          <div className="summary-url-section">
            <h2 className="summary-title">Analysis Results</h2>
            <p className="summary-url">
              <span className="url-label">URL:</span>
              <span className="url-value">{analysis.url}</span>
            </p>
            <p className="summary-timestamp">
              <span className="timestamp-label">Analyzed:</span>
              <span className="timestamp-value">{formatDate(analysis.timestamp)}</span>
            </p>
          </div>

          <div className="summary-metrics">
            <div className="metric-card">
              <div className="metric-icon">{getStatusIcon(analysis.overallScore)}</div>
              <div className="metric-content">
                <p className="metric-label">Overall Score</p>
                <p className="metric-value">{analysis.overallScore}%</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ color: 'var(--color-crimson)' }}>
                {issues.critical}
              </div>
              <div className="metric-content">
                <p className="metric-label">Critical Issues</p>
                <p className="metric-sublabel">Action required</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ color: 'var(--color-amber)' }}>
                {issues.warning}
              </div>
              <div className="metric-content">
                <p className="metric-label">Warnings</p>
                <p className="metric-sublabel">Worth reviewing</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ color: 'var(--color-emerald)' }}>
                {analysis.recommendations.length}
              </div>
              <div className="metric-content">
                <p className="metric-label">Recommendations</p>
                <p className="metric-sublabel">To improve compliance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-quick-stats">
          <div className="quick-stat">
            <span className="stat-icon">🔒</span>
            <span className="stat-label">Security Score:</span>
            <span className="stat-value">{analysis.security.score}%</span>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">👁️</span>
            <span className="stat-label">Privacy Score:</span>
            <span className="stat-value">{analysis.gdpr.score}%</span>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">♿</span>
            <span className="stat-label">Accessibility Score:</span>
            <span className="stat-value">{analysis.accessibility.score}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
