import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onScanClick?: () => void;
}

export function Header({ onScanClick }: HeaderProps) {
  const navigate = useNavigate();

  const handleScanClick = () => {
    if (onScanClick) {
      onScanClick();
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="tessera-header" role="banner">
        <div className="container">
          <div className="header-inner">
            <Link to="/" className="logo-link" aria-label="Tessera — Standards Made Visible">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 8L12 4.5L18 8V14L12 17.5L6 14Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12L14 8.5L20 12V18L14 21.5L8 18Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 14L10 10.5L16 14V20L10 23.5L4 20Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10.75" r="1.8" fill="#0066cc" opacity="0.8"/>
                <circle cx="14" cy="15" r="1.8" fill="#0066cc" opacity="0.8"/>
                <circle cx="10" cy="17" r="1.8" fill="#0066cc" opacity="0.8"/>
              </svg>
              <span className="logo-wordmark">Tessera</span>
            </Link>

            <nav className="header-nav" aria-label="Main navigation">
              <Link to="/#features">Features</Link>
              <Link to="/#how-it-works">How It Works</Link>
              <Link to="/pricing">Pricing</Link>
            </nav>

            <div className="header-cta">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleScanClick}
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
