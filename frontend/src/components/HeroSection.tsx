import React, { useState, FormEvent } from 'react';

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Standards Made Visible</span>
          </h1>
          <p className="hero-subtitle">
            Real-time security, privacy, and accessibility compliance audits for your website
          </p>

          <form className="hero-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="url"
                className="form-input hero-input"
                placeholder="Enter your website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Scan Your Site Free'}
              </button>
            </div>
          </form>

          <p className="hero-footnote">
            ✓ No credit card required • ✓ 60-second analysis • ✓ Complete compliance report
          </p>
        </div>

        {/* Visual element - Tessera tiles pattern */}
        <div className="hero-visual">
          <div className="tile-pattern">
            <div className="tile tile-1"></div>
            <div className="tile tile-2"></div>
            <div className="tile tile-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
