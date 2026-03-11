import React from 'react';
import { Recommendation } from '../types/analysis';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'security':
        return '🔒';
      case 'gdpr':
        return '👁️';
      case 'privacy':
        return '👁️';
      case 'accessibility':
        return '♿';
      default:
        return '📋';
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'security':
        return 'Security';
      case 'gdpr':
        return 'Privacy & GDPR';
      case 'privacy':
        return 'Privacy & GDPR';
      case 'accessibility':
        return 'Accessibility';
      default:
        return 'General';
    }
  };

  const getSeverityPriority = (severity: string): number => {
    switch (severity) {
      case 'critical':
        return 4;
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return '#e74c3c';
      case 'high':
        return '#ff7675';
      case 'medium':
        return '#f1c40f';
      case 'low':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  // Sort recommendations by severity (critical first)
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => getSeverityPriority(b.severity) - getSeverityPriority(a.severity)
  );

  // Group recommendations by category
  const grouped = sortedRecommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  const categories = Object.keys(grouped).sort();

  if (recommendations.length === 0) {
    return (
      <section className="recommendations-section">
        <div className="container">
          <h2 className="section-title">Recommendations</h2>
          <div className="no-recommendations">
            <span className="no-rec-icon">✨</span>
            <p className="no-rec-text">No immediate recommendations. Your site is in excellent compliance shape!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="recommendations-section">
      <div className="container">
        <div className="recommendations-header">
          <h2 className="section-title">Recommendations</h2>
          <span className="recommendations-count">{recommendations.length} actions to improve</span>
        </div>

        {categories.map((category) => (
          <div key={category} className="recommendations-category">
            <h3 className="category-heading">
              <span className="category-icon">{getCategoryIcon(category)}</span>
              {getCategoryLabel(category)}
              <span className="category-count">({grouped[category].length})</span>
            </h3>

            <div className="recommendations-list">
              {grouped[category].map((rec, idx) => (
                <div
                  key={`${category}-${idx}`}
                  className="recommendation-card"
                  style={{
                    borderLeftColor: getSeverityColor(rec.severity),
                  }}
                >
                  <div className="recommendation-header">
                    <h4 className="recommendation-title">{rec.title}</h4>
                    <span
                      className="severity-label"
                      style={{
                        backgroundColor: getSeverityColor(rec.severity),
                      }}
                    >
                      {rec.severity.charAt(0).toUpperCase() + rec.severity.slice(1)}
                    </span>
                  </div>

                  <p className="recommendation-description">{rec.description}</p>

                  <div className="recommendation-action">
                    <span className="action-label">Action:</span>
                    <p className="action-text">{rec.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
