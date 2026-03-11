import React from 'react';

export function Header() {
  return (
    <header className="tessera-header">
      <div className="container">
        <div className="header-content">
          {/* Tessera Logo - Interlocking Tiles */}
          <div className="logo-section">
            <div className="tessera-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Three interlocking tiles in isometric perspective */}
                {/* Tile 1 (Security) */}
                <path d="M6 8L12 4.5L18 8V14L12 17.5L6 14Z" stroke="var(--color-navy)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Tile 2 (Privacy) - Offset */}
                <path d="M8 12L14 8.5L20 12V18L14 21.5L8 18Z" stroke="var(--color-navy)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Tile 3 (Accessibility) - Offset */}
                <path d="M4 14L10 10.5L16 14V20L10 23.5L4 20Z" stroke="var(--color-navy)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Connection points in Cobalt */}
                <circle cx="12" cy="10.75" r="2" fill="var(--color-cobalt)" opacity="0.7"/>
                <circle cx="14" cy="15" r="2" fill="var(--color-cobalt)" opacity="0.7"/>
                <circle cx="10" cy="17" r="2" fill="var(--color-cobalt)" opacity="0.7"/>
              </svg>
              <span className="logo-text">Tessera</span>
            </div>
            <p className="tagline">Standards Made Visible</p>
          </div>

          {/* Navigation */}
          <nav className="header-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#docs">Docs</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
