import React from 'react';

interface HeaderProps {
  onScanClick?: () => void;
}

export function Header({ onScanClick }: HeaderProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="tessera-header" role="banner">
        <div className="container">
          <div className="header-inner">
            <a href="/" className="logo-link" aria-label="Tessera — Standards Made Visible">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 8L12 4.5L18 8V14L12 17.5L6 14Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12L14 8.5L20 12V18L14 21.5L8 18Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 14L10 10.5L16 14V20L10 23.5L4 20Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10.75" r="1.8" fill="#0066cc" opacity="0.8"/>
                <circle cx="14" cy="15" r="1.8" fill="#0066cc" opacity="0.8"/>
                <circle cx="10" cy="17" r="1.8" fill="#0066cc" opacity="0.8"/>
              </svg>
              <span className="logo-wordmark">Tessera</span>
            </a>

            <nav className="header-nav" aria-label="Main navigation">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </nav>

            <div className="header-cta">
              <button
                className="btn btn-primary btn-sm"
                onClick={onScanClick}
                aria-label="Start a free compliance scan"
              >
                Free Scan
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
