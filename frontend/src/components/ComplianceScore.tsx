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
    const r = 54;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="score-circle-wrapper">
        <div className="score-circle-container">
          <svg className="score-circle-svg" viewBox="0 0 120 120" role="img" aria-label={`${label} score: ${score}%`}>
            <circle cx="60" cy="60" r={r} className="score-circle-bg" />
            <circle
              cx="60" cy="60" r={r}
              className="score-circle-progress"
              style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{score}</span>
            <span className="score-percent">%</span>
          </div>
        </div>
        <p className="score-label">{label}</p>
        <p className="score-category" aria-hidden="true">{icon}</p>
      </div>
    );
  };

  const overallR = 90;
  const overallCirc = 2 * Math.PI * overallR;
  const overallOffset = overallCirc - (overallScore / 100) * overallCirc;

  return (
    <section className="compliance-score-section" aria-labelledby="score-heading">
      <div className="container">
        <h2 id="score-heading">Your Compliance Score</h2>

        <div className="overall-score-card">
          <div className="overall-score-display">
            <svg className="large-circle" viewBox="0 0 200 200" role="img" aria-label={`Overall compliance score: ${overallScore}%`}>
              <circle cx="100" cy="100" r={overallR} className="score-circle-bg" />
              <circle
                cx="100" cy="100" r={overallR}
                className="score-circle-progress"
                style={{ strokeDasharray: overallCirc, strokeDashoffset: overallOffset }}
                transform="rotate(-90 100 100)"
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
              Overall compliance across security, privacy, and accessibility standards
            </p>
          </div>
        </div>

        <div className="category-scores">
          <ScoreCircle score={securityScore} label="Security" icon="🔒" />
          <ScoreCircle score={privacyScore} label="Privacy" icon="👁️" />
          <ScoreCircle score={accessibilityScore} label="Accessibility" icon="♿" />
        </div>

        <div className="score-bars-section">
          {[
            { label: 'Security', icon: '🔒', score: securityScore },
            { label: 'Privacy', icon: '👁️', score: privacyScore },
            { label: 'Accessibility', icon: '♿', score: accessibilityScore },
          ].map(({ label, icon, score }) => (
            <div className="score-bar-item" key={label}>
              <div className="score-bar-header">
                <span className="score-bar-label">
                  <span aria-hidden="true">{icon}</span> {label}
                </span>
                <span className="score-bar-value">{score}%</span>
              </div>
              <div className="score-bar" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} score`}>
                <div className="score-bar-fill" style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
