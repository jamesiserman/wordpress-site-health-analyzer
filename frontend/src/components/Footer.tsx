import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="tessera-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo-wordmark" style={{ color: 'white', fontSize: '20px', textDecoration: 'none' }}>Tessera</Link>
            <p>
              Real-time compliance audits for security, privacy, and
              accessibility. Standards Made Visible.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/#features">Features</Link>
            <Link to="/#how-it-works">How It Works</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div className="footer-col">
            <h4>Standards</h4>
            <Link to="/security">OWASP Security</Link>
            <Link to="/privacy">GDPR Privacy</Link>
            <Link to="/accessibility">WCAG Accessibility</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/docs">Documentation</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Tessera. All rights reserved.</span>
          <span><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link> &middot; <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link></span>
        </div>
      </div>
    </footer>
  );
}
