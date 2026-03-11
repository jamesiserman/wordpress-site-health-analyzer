import React from 'react';

interface ComplianceScoreProps {
  overallScore: number;
  securityScore: number;
  privacyScore: number;
  accessibilityScore: number;
}

export function ComplianceScore({
  overallScore,
  securityScore,
  privacyScore,
  accessibilityScore,
}: ComplianceScoreProps) {
  const getScoreStatus = (score: number): string => {
    if (score >= 90) return 'Excellent Ground';
    if (score >= 80) return 'Solid Ground';
    if (score >= 70) return 'Good Foundation';
    if (score >= 60) return 'Needs Attention';
    return 'Critical Issues';
  };

  const getScoreStatusColor = (score: number): string => {
    if (score >= 80) return 'status-excellent';
    if (score >= 60) return 'status-good';
    return 'status-poor';
  };

  const ScoreCircle = ({ score, label, icon }: { score: number; label: string; icon: string }) => {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="score-circle-wrapper">
        <div className="score-circle-container">
          <svg className="score-circle-svg" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle cx="60" cy="60" r="54" className="score-circle-bg" />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              className="score-circle-progress"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{score}</span>
            <span className="score-percent">%</span>
          </div>
        </div>
        <p className="score-label">{label}</p>
        <p className="score-category">{icon}</p>
      </div>
    );
  };

  return (
    <section className="compliance-score-section">
      <div className="container">
        <h2 className="section-title">Your Compliance Score</h2>

        {/* Overall Score */}
        <div className="overall-score-card">
          <div className="overall-score-content">
            <div className="overall-score-display">
              <svg className="large-circle" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" className="score-circle-bg" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="score-circle-progress"
                  style={{
                    strokeDasharray: 2 * Math.PI * 90,
                    strokeDashoffset: 2 * Math.PI * 90 - (overallScore / 100) * 2 * Math.PI * 90,
                  }}
                />
              </svg>
              <div className="overall-score-text">
                <span className="overall-number">{overallScore}</span>
                <span className="overall-percent">%</span>
              </div>
            </div>
            <div className="overall-status">
              <p className={`status-label ${getScoreStatusColor(overallScore)}`}>
                {getScoreStatus(overallScore)}
              </p>
              <p className="status-message">
                Overall compliance score across all standards
              </p>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="category-scores">
          <ScoreCircle score={securityScore} label="Security" icon="🔒" />
          <ScoreCircle score={privacyScore} label="Privacy" icon="👁️" />
          <ScoreCircle score={accessibilityScore} label="Accessibility" icon="♿" />
        </div>

        {/* Score Breakdown Bars */}
        <div className="score-bars-section">
          <div className="score-bar-item">
            <div className="score-bar-header">
              <span className="score-bar-label">🔒 Security</span>
              <span className="score-bar-value">{securityScore}%</span>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${securityScore}%` }}></div>
            </div>
          </div>

          <div className="score-bar-item">
            <div className="score-bar-header">
              <span className="score-bar-label">👁️ Privacy</span>
              <span className="score-bar-value">{privacyScore}%</span>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${privacyScore}%` }}></div>
            </div>
          </div>

          <div className="score-bar-item">
            <div className="score-bar-header">
              <span className="score-bar-label">♿ Accessibility</span>
              <span className="score-bar-value">{accessibilityScore}%</span>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${accessibilityScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
