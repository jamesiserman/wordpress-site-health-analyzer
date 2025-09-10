import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { AnalysisResult } from '../types/analysis';

function SimpleApp() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeCategory, setActiveCategory] = useState<'security' | 'gdpr' | 'accessibility' | null>(null);
  const [hoveredCard, setHoveredCard] = useState<'security' | 'gdpr' | 'accessibility' | null>(null);
  const [expandedCard, setExpandedCard] = useState<'security' | 'gdpr' | 'accessibility' | null>(null);

  const normalizeUrl = (inputUrl: string): string => {
    let normalizedUrl = inputUrl.trim();
    
    // Remove protocol if present to start fresh
    normalizedUrl = normalizedUrl.replace(/^https?:\/\//, '');
    
    // Add https:// if no protocol is present
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    return normalizedUrl;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const normalizedUrl = normalizeUrl(url);
    console.log('🚀 Starting analysis for:', normalizedUrl);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      console.log('📡 Calling API service...');
      const result = await ApiService.analyzeWebsite(normalizedUrl);
      console.log('✅ Analysis completed successfully:', result);
      
      if (result && typeof result === 'object') {
        console.log('📊 Setting analysis result...');
        setAnalysis(result);
        console.log('✨ Analysis state updated');
      } else {
        console.error('❌ Invalid result format:', result);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('💥 Analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze website';
      console.log('🔴 Setting error:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('🏁 Analysis process completed, setting loading to false');
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'badge critical';
      case 'medium':
        return 'badge medium';
      default:
        return 'badge low';
    }
  };

  const getRiskAssessment = (category: 'security' | 'gdpr' | 'accessibility') => {
    if (!analysis) return [];
    
    switch (category) {
      case 'security':
        return [
          {
            level: analysis.security.vulnerabilities.length > 0 ? 'high' : 'low',
            icon: analysis.security.vulnerabilities.length > 0 ? '⚠️' : '✅',
            title: 'Vulnerabilities',
            description: analysis.security.vulnerabilities.length > 0 
              ? `${analysis.security.vulnerabilities.length} vulnerabilities found`
              : 'No known vulnerabilities found'
          },
          {
            level: !analysis.security.sslCertificate.isValid ? 'high' : 'low',
            icon: analysis.security.sslCertificate.isValid ? '🔒' : '🔓',
            title: 'SSL Certificate',
            description: analysis.security.sslCertificate.isValid 
              ? `Valid SSL certificate (Grade: ${analysis.security.sslCertificate.grade || 'Unknown'})`
              : 'SSL certificate issues detected'
          },
          {
            level: analysis.security.securityHeaders.score > 20 ? 'low' : 'medium',
            icon: analysis.security.securityHeaders.score > 20 ? '🛡️' : '👁️',
            title: 'Security Headers',
            description: analysis.security.securityHeaders.score > 20
              ? 'Good security headers implementation'
              : 'Missing important security headers'
          }
        ];
      case 'gdpr':
        return [
          {
            level: analysis.gdpr.hasCookieBanner ? 'low' : 'high',
            icon: analysis.gdpr.hasCookieBanner ? '🍪' : '❌',
            title: 'Cookie Consent',
            description: analysis.gdpr.hasCookieBanner
              ? 'Cookie consent banner detected'
              : 'No cookie consent banner found - GDPR violation risk'
          },
          {
            level: analysis.gdpr.hasPrivacyPolicy ? 'low' : 'high',
            icon: analysis.gdpr.hasPrivacyPolicy ? '📋' : '❌',
            title: 'Privacy Policy',
            description: analysis.gdpr.hasPrivacyPolicy
              ? 'Privacy policy link found'
              : 'No privacy policy link detected - GDPR requirement'
          },
          {
            level: analysis.gdpr.trackers.filter(t => t.detected).length > 3 ? 'high' : analysis.gdpr.trackers.filter(t => t.detected).length > 0 ? 'medium' : 'low',
            icon: '📊',
            title: 'Tracking Scripts',
            description: `${analysis.gdpr.trackers.filter(t => t.detected).length} tracking scripts detected`
          }
        ];
      case 'accessibility':
        return [
          {
            level: analysis.accessibility.missingAltImages > 5 ? 'high' : analysis.accessibility.missingAltImages > 0 ? 'medium' : 'low',
            icon: analysis.accessibility.missingAltImages === 0 ? '🖼️' : '⚠️',
            title: 'Image Accessibility',
            description: analysis.accessibility.missingAltImages === 0
              ? 'All images have alt text'
              : `${analysis.accessibility.missingAltImages} images missing alt text`
          },
          {
            level: analysis.accessibility.headingIssues.length > 0 ? 'medium' : 'low',
            icon: analysis.accessibility.headingIssues.length === 0 ? '📝' : '⚠️',
            title: 'Heading Structure',
            description: analysis.accessibility.headingIssues.length === 0
              ? 'Proper heading hierarchy detected'
              : `${analysis.accessibility.headingIssues.length} heading structure issues`
          },
          {
            level: analysis.accessibility.missingAriaLabels > 3 ? 'high' : analysis.accessibility.missingAriaLabels > 0 ? 'medium' : 'low',
            icon: analysis.accessibility.missingAriaLabels === 0 ? '🏷️' : '⚠️',
            title: 'ARIA Labels',
            description: analysis.accessibility.missingAriaLabels === 0
              ? 'All interactive elements have ARIA labels'
              : `${analysis.accessibility.missingAriaLabels} elements missing ARIA labels`
          }
        ];
      default:
        return [];
    }
  };

  if (!analysis && !isLoading && !error) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div style={{
          padding: '80px 0',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative'}}>
            <div className="fade-in-up">
              <h1 className="display-large" style={{
                fontSize: '96px',
                fontWeight: '900',
                color: '#000000',
                lineHeight: '1.05',
                marginBottom: '24px',
                letterSpacing: '4px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative',
                fontStretch: 'ultra-expanded',
                WebkitTextStroke: '8px #000000'
              } as React.CSSProperties}>
                SITE PULSE
                <svg 
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '800px',
                    height: '20px',
                    zIndex: 1
                  }}
                  viewBox="0 0 800 20"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.2">
                        <animate attributeName="stop-opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#000000" stopOpacity="0.6">
                        <animate attributeName="stop-opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="0.5s" />
                      </stop>
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.2">
                        <animate attributeName="stop-opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="1s" />
                      </stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,10 L50,10 L60,2 L75,18 L90,10 L110,10 L130,10 L150,10 L160,10 L180,2 L195,18 L210,2 L225,18 L240,10 L260,10 L280,10 L300,10 L320,10 L340,2 L355,18 L370,10 L390,10 L410,10 L430,10 L450,10 L470,2 L485,18 L500,2 L515,18 L530,10 L550,10 L570,10 L590,10 L610,10 L630,2 L645,18 L660,10 L680,10 L700,10 L720,10 L740,10 L760,2 L775,18 L790,10 L800,10"
                    stroke="url(#pulseGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h1>
              <p className="display-medium" style={{
                fontSize: '28px',
                fontWeight: '500',
                color: '#1d1d1f',
                lineHeight: '1.3',
                marginBottom: '48px',
                maxWidth: '800px',
                margin: '0 auto 48px'
              }}>
Comprehensive security, GDPR compliance, and accessibility analysis for marketing agencies and web professionals.
              </p>
            </div>
            
            {/* Analysis Form */}
            <div style={{maxWidth: '800px', margin: '0 auto 80px'}}>
              <form onSubmit={handleAnalyze} className="text-center">
                <div style={{marginBottom: '32px'}}>
                  <input
                    id="url"
                    type="text"
                    placeholder="Enter your website URL (e.g., example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="input"
                    style={{
                      fontSize: '20px', 
                      padding: '24px 32px', 
                      marginBottom: '32px',
                      maxWidth: '600px',
                      width: '100%'
                    }}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-large">
                  Start Analysis
                </button>
              </form>
            </div>

            {/* Analysis Categories */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              marginBottom: '64px',
              maxWidth: '1200px',
              margin: '0 auto 64px'
            }}>
                <div 
                className="stat-card fade-in-up"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === 'security' ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredCard === 'security' ? '0 20px 60px rgba(0,0,0,0.12)' : 'none',
                  background: 'transparent',
                  border: hoveredCard === 'security' ? '2px solid #000000' : 'none',
                  borderRadius: '0px',
                  padding: '40px 32px',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredCard('security')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: '0.1',
                  zIndex: 0
                }}>
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#000000"/>
                </svg>
                <div style={{
                  fontSize: '24px', 
                  fontWeight: '900', 
                  color: '#000000',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  fontStretch: 'expanded'
                } as React.CSSProperties}>Security</div>
                <div style={{
                  fontSize: '16px',
                  color: '#86868b',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  maxHeight: expandedCard === 'security' ? '200px' : '0',
                  opacity: expandedCard === 'security' ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  paddingBottom: '40px'
                }}>
                  SSL/TLS certificate validation, security headers analysis, console security warnings, reputation checks, and vulnerability detection. We assess your site's security posture using publicly available information.
                </div>
                <button
                  onClick={() => setExpandedCard(expandedCard === 'security' ? null : 'security')}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #86868b',
                    background: expandedCard === 'security' ? '#86868b' : 'transparent',
                    color: expandedCard === 'security' ? '#ffffff' : '#86868b',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  i
                </button>
              </div>
              
              <div 
                className="stat-card fade-in-up"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === 'gdpr' ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredCard === 'gdpr' ? '0 20px 60px rgba(0,0,0,0.12)' : 'none',
                  background: 'transparent',
                  border: hoveredCard === 'gdpr' ? '2px solid #000000' : 'none',
                  borderRadius: '0px',
                  padding: '40px 32px',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredCard('gdpr')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: '0.1',
                  zIndex: 0
                }}>
                  <path d="M12 3L2 12H5V20H19V12H22L12 3ZM12 7.69L17 12.19V18H15V14H9V18H7V12.19L12 7.69ZM11 15H13V17H11V15Z" fill="#000000"/>
                  <path d="M9 10H15V12H9V10Z" fill="#000000"/>
                </svg>
                <div style={{
                  fontSize: '24px', 
                  fontWeight: '900', 
                  color: '#000000',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  fontStretch: 'expanded'
                } as React.CSSProperties}>GDPR</div>
                <div style={{
                  fontSize: '16px',
                  color: '#86868b',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  maxHeight: expandedCard === 'gdpr' ? '200px' : '0',
                  opacity: expandedCard === 'gdpr' ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  paddingBottom: '40px'
                }}>
                  Cookie consent, privacy policies, and tracking script compliance analysis. We verify GDPR requirements, check consent mechanisms, and identify data collection practices.
                </div>
                <button
                  onClick={() => setExpandedCard(expandedCard === 'gdpr' ? null : 'gdpr')}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #86868b',
                    background: expandedCard === 'gdpr' ? '#86868b' : 'transparent',
                    color: expandedCard === 'gdpr' ? '#ffffff' : '#86868b',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  i
                </button>
              </div>
              
              <div 
                className="stat-card fade-in-up"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === 'accessibility' ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredCard === 'accessibility' ? '0 20px 60px rgba(0,0,0,0.12)' : 'none',
                  background: 'transparent',
                  border: hoveredCard === 'accessibility' ? '2px solid #000000' : 'none',
                  borderRadius: '0px',
                  padding: '40px 32px',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredCard('accessibility')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: '0.1',
                  zIndex: 0
                }}>
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 9H14V4H5V21H19V9ZM7 11H17V13H7V11ZM7 15H17V17H7V15ZM7 19H14V21H7V19Z" fill="#000000"/>
                </svg>
                <div style={{
                  fontSize: '24px', 
                  fontWeight: '900', 
                  color: '#000000',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  fontStretch: 'expanded'
                } as React.CSSProperties}>Accessibility</div>
                <div style={{
                  fontSize: '16px',
                  color: '#86868b',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  maxHeight: expandedCard === 'accessibility' ? '200px' : '0',
                  opacity: expandedCard === 'accessibility' ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  paddingBottom: '40px'
                }}>
                  Alt text, heading structure, ARIA labels, and web accessibility standards. We evaluate compliance with WCAG guidelines and identify barriers for users with disabilities.
                </div>
                <button
                  onClick={() => setExpandedCard(expandedCard === 'accessibility' ? null : 'accessibility')}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #86868b',
                    background: expandedCard === 'accessibility' ? '#86868b' : 'transparent',
                    color: expandedCard === 'accessibility' ? '#ffffff' : '#86868b',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  i
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)'}}>
        <div className="text-center">
          <div className="spinner" style={{margin: '0 auto 32px'}}></div>
          <h2 style={{fontSize: '32px', fontWeight: '600', color: '#000000', marginBottom: '16px'}}>Analyzing Website</h2>
          <p style={{fontSize: '19px', color: '#86868b', marginBottom: '32px'}}>Running comprehensive health checks...</p>
          <div style={{fontSize: '17px', color: '#86868b', lineHeight: '1.6'}}>
            <div>Checking security vulnerabilities</div>
            <div>Scanning GDPR compliance</div>
            <div>Testing accessibility standards</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)'}}>
        <div className="text-center" style={{maxWidth: '500px', padding: '48px'}}>
          <div style={{fontSize: '64px', marginBottom: '24px'}}>⚠️</div>
          <h2 style={{fontSize: '32px', fontWeight: '600', color: '#000000', marginBottom: '16px'}}>Analysis Failed</h2>
          <p style={{fontSize: '19px', color: '#86868b', marginBottom: '32px', lineHeight: '1.4'}}>{error}</p>
          <button 
            onClick={() => {setError(null); setUrl('');}} 
            className="btn btn-primary btn-large"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="text-center mb-8" style={{padding: '48px 0'}}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#000000',
            lineHeight: '1.1',
            marginBottom: '16px',
            letterSpacing: '-0.025em'
          }}>
            Site Health Report
          </h1>
          <p style={{fontSize: '19px', color: '#86868b'}}>
            {new Date(analysis!.timestamp).toLocaleDateString()} • {analysis!.url}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Analysis Results */}
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="card" style={{background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '18px'}}>
              <div style={{padding: '32px', textAlign: 'center'}}>
                <h2 style={{fontSize: '24px', fontWeight: '600', color: '#000000', marginBottom: '32px'}}>
                  Overall Health Score
                </h2>
                <div style={{marginBottom: '32px'}}>
                  <div style={{
                    fontSize: '96px',
                    fontWeight: '700',
                    lineHeight: '1',
                    marginBottom: '8px'
                  }} className={getScoreColor(analysis!.overallScore)}>
                    {analysis!.overallScore}%
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '600'
                  }} className={getScoreColor(analysis!.overallScore)}>
                    Grade {getScoreGrade(analysis!.overallScore)}
                  </div>
                </div>
                <div className="progress" style={{height: '12px', marginBottom: '16px'}}>
                  <div 
                    className="progress-bar"
                    style={{width: `${analysis!.overallScore}%`}}
                  ></div>
                </div>
                <p style={{fontSize: '15px', color: '#86868b'}}>
                  Analyzed on {new Date(analysis!.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid-3">
              <div className="card" style={{background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '18px'}}>
                <div style={{padding: '24px 24px 0 24px'}}>
                  <button 
                    className={`category-button w-full text-left ${activeCategory === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === 'security' ? null : 'security')}
                    style={{border: 'none', background: 'transparent', padding: '0', cursor: 'pointer'}}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{fontSize: '24px'}}>🛡️</span>
                      <h3 style={{fontSize: '20px', fontWeight: '600', color: '#000000'}}>Security</h3>
                      <span style={{marginLeft: 'auto', fontSize: '15px', color: '#86868b'}}>Details</span>
                    </div>
                  </button>
                </div>
                <div style={{padding: '0 24px 24px 24px'}}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{fontSize: '32px', fontWeight: '700'}} className={getScoreColor(analysis!.categoryScores.security)}>
                        {analysis!.categoryScores.security}%
                      </span>
                      <span style={{fontSize: '20px', fontWeight: '600'}} className={getScoreColor(analysis!.categoryScores.security)}>{getScoreGrade(analysis!.categoryScores.security)}</span>
                    </div>
                    <div className="text-right">
                      <div style={{fontSize: '15px', fontWeight: '500', color: '#86868b'}}>
                        {analysis!.security.vulnerabilities.length === 0 ? 'No Issues' : `${analysis!.security.vulnerabilities.length} Issues`}
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '8px', marginBottom: '16px'}}>
                    <div 
                      className="progress-bar security" 
                      style={{width: `${analysis!.categoryScores.security}%`}}
                    ></div>
                  </div>
                  <div style={{fontSize: '15px'}}>
                    <div className="flex items-center gap-1">
                      <span>{analysis!.security.sslCertificate.isValid ? '🔒' : '🔓'}</span>
                      <span style={{color: '#000000'}}>SSL Certificate: {analysis!.security.sslCertificate.isValid ? 'Valid' : 'Invalid'}</span>
                      {analysis!.security.sslCertificate.grade && (
                        <span style={{color: '#86868b', marginLeft: '8px'}}>Grade {analysis!.security.sslCertificate.grade}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1" style={{marginTop: '8px'}}>
                      <span>{analysis!.security.securityHeaders.score > 15 ? '✅' : '❌'}</span>
                      <span style={{color: '#000000'}}>Security Headers: {analysis!.security.securityHeaders.score}/30</span>
                    </div>
                    <div className="flex items-center gap-1" style={{marginTop: '8px'}}>
                      <span>{analysis!.security.consoleWarnings.length === 0 ? '✅' : '⚠️'}</span>
                      <span style={{color: '#000000'}}>Console Warnings: {analysis!.security.consoleWarnings.length}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{marginTop: '8px'}}>
                      <span>{analysis!.security.reputationChecks.every(check => check.status === 'clean') ? '✅' : '⚠️'}</span>
                      <span style={{color: '#000000'}}>Reputation: {analysis!.security.reputationChecks.filter(check => check.status === 'clean').length}/{analysis!.security.reputationChecks.length} clean</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{analysis!.security.sslCertificate.isValid ? '🔒' : '🔓'}</span>
                      <span style={{color: '#000000'}}>SSL Certificate: {analysis!.security.sslCertificate.isValid ? 'Valid' : 'Invalid'}</span>
                      {analysis!.security.sslCertificate.grade && (
                        <span style={{color: '#86868b', marginLeft: '8px'}}>Grade {analysis!.security.sslCertificate.grade}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1" style={{marginTop: '8px'}}>
                      <span>{analysis!.security.consoleWarnings.length === 0 ? '✅' : '⚠️'}</span>
                      <span style={{color: '#000000'}}>Console Warnings: {analysis!.security.consoleWarnings.length}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{marginTop: '8px'}}>
                      <span>{analysis!.security.reputationChecks.every(check => check.status === 'clean') ? '✅' : '⚠️'}</span>
                      <span style={{color: '#000000'}}>Reputation: {analysis!.security.reputationChecks.filter(check => check.status === 'clean').length}/{analysis!.security.reputationChecks.length} clean</span>
                    </div>
                  </div>
                  {activeCategory === 'security' && (
                    <div className="risk-panel">
                      <h4 style={{fontSize: '17px', fontWeight: '600', color: '#000000', marginBottom: '16px'}}>Security Risk Assessment</h4>
                      {getRiskAssessment('security').map((risk, index) => (
                        <div key={index} className="risk-item">
                          <div className={`risk-icon ${risk.level}`}>
                            {risk.icon}
                          </div>
                          <div className="risk-content">
                            <h4>{risk.title}</h4>
                            <p>{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card" style={{background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '18px'}}>
                <div style={{padding: '24px 24px 0 24px'}}>
                  <button 
                    className={`category-button w-full text-left ${activeCategory === 'gdpr' ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === 'gdpr' ? null : 'gdpr')}
                    style={{border: 'none', background: 'transparent', padding: '0', cursor: 'pointer'}}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{fontSize: '24px'}}>⚖️</span>
                      <h3 style={{fontSize: '20px', fontWeight: '600', color: '#000000'}}>GDPR</h3>
                      <span style={{marginLeft: 'auto', fontSize: '15px', color: '#86868b'}}>Details</span>
                    </div>
                  </button>
                </div>
                <div style={{padding: '0 24px 24px 24px'}}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{fontSize: '32px', fontWeight: '700'}} className={getScoreColor(analysis!.categoryScores.gdpr)}>
                        {analysis!.categoryScores.gdpr}%
                      </span>
                      <span style={{fontSize: '20px', fontWeight: '600'}} className={getScoreColor(analysis!.categoryScores.gdpr)}>{getScoreGrade(analysis!.categoryScores.gdpr)}</span>
                    </div>
                    <div className="text-right">
                      <div style={{fontSize: '15px', fontWeight: '500', color: '#86868b'}}>
                        {analysis!.gdpr.trackers.filter(t => t.detected).length} Trackers
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '8px', marginBottom: '16px'}}>
                    <div 
                      className="progress-bar gdpr" 
                      style={{width: `${analysis!.categoryScores.gdpr}%`}}
                    ></div>
                  </div>
                  <div style={{fontSize: '15px'}}>
                    <div className="flex items-center gap-1" style={{marginBottom: '4px'}}>
                      <span>{analysis!.gdpr.hasCookieBanner ? '✅' : '❌'}</span>
                      <span style={{color: '#000000', fontWeight: '500'}}>Cookie consent banner</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{analysis!.gdpr.hasPrivacyPolicy ? '✅' : '❌'}</span>
                      <span style={{color: '#000000', fontWeight: '500'}}>Privacy policy link</span>
                    </div>
                  </div>
                  {activeCategory === 'gdpr' && (
                    <div className="risk-panel">
                      <h4 style={{fontSize: '17px', fontWeight: '600', color: '#000000', marginBottom: '16px'}}>GDPR Compliance Assessment</h4>
                      {getRiskAssessment('gdpr').map((risk, index) => (
                        <div key={index} className="risk-item">
                          <div className={`risk-icon ${risk.level}`}>
                            {risk.icon}
                          </div>
                          <div className="risk-content">
                            <h4>{risk.title}</h4>
                            <p>{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card" style={{background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '18px'}}>
                <div style={{padding: '24px 24px 0 24px'}}>
                  <button 
                    className={`category-button w-full text-left ${activeCategory === 'accessibility' ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === 'accessibility' ? null : 'accessibility')}
                    style={{border: 'none', background: 'transparent', padding: '0', cursor: 'pointer'}}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{fontSize: '24px'}}>♿</span>
                      <h3 style={{fontSize: '20px', fontWeight: '600', color: '#000000'}}>Accessibility</h3>
                      <span style={{marginLeft: 'auto', fontSize: '15px', color: '#86868b'}}>Details</span>
                    </div>
                  </button>
                </div>
                <div style={{padding: '0 24px 24px 24px'}}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{fontSize: '32px', fontWeight: '700'}} className={getScoreColor(analysis!.categoryScores.accessibility)}>
                        {analysis!.categoryScores.accessibility}%
                      </span>
                      <span style={{fontSize: '20px', fontWeight: '600'}} className={getScoreColor(analysis!.categoryScores.accessibility)}>{getScoreGrade(analysis!.categoryScores.accessibility)}</span>
                    </div>
                    <div className="text-right">
                      <div style={{fontSize: '15px', fontWeight: '500', color: '#86868b'}}>
                        {(analysis!.accessibility.missingAltImages + analysis!.accessibility.headingIssues.length + analysis!.accessibility.missingAriaLabels) === 0 ? 'Perfect' : `${analysis!.accessibility.missingAltImages + analysis!.accessibility.headingIssues.length + analysis!.accessibility.missingAriaLabels} Issues`}
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '8px', marginBottom: '16px'}}>
                    <div 
                      className="progress-bar accessibility" 
                      style={{width: `${analysis!.categoryScores.accessibility}%`}}
                    ></div>
                  </div>
                  <div style={{fontSize: '15px'}}>
                    <div className="flex items-center gap-1" style={{marginBottom: '4px'}}>
                      <span>🖼️</span>
                      <span style={{color: '#000000', fontWeight: '500'}}>Missing alt text: {analysis!.accessibility.missingAltImages}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{marginBottom: '4px'}}>
                      <span>📝</span>
                      <span style={{color: '#000000', fontWeight: '500'}}>Heading issues: {analysis!.accessibility.headingIssues.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🏷️</span>
                      <span style={{color: '#000000', fontWeight: '500'}}>Missing ARIA labels: {analysis!.accessibility.missingAriaLabels}</span>
                    </div>
                  </div>
                  {activeCategory === 'accessibility' && (
                    <div className="risk-panel">
                      <h4 style={{fontSize: '17px', fontWeight: '600', color: '#000000', marginBottom: '16px'}}>Accessibility Assessment</h4>
                      {getRiskAssessment('accessibility').map((risk, index) => (
                        <div key={index} className="risk-item">
                          <div className={`risk-icon ${risk.level}`}>
                            {risk.icon}
                          </div>
                          <div className="risk-content">
                            <h4>{risk.title}</h4>
                            <p>{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {analysis!.recommendations.length > 0 && (
              <div className="card" style={{background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '18px'}}>
                <div style={{padding: '32px 32px 0 32px'}}>
                  <div className="flex items-center gap-2">
                    <span style={{fontSize: '24px'}}>💡</span>
                    <h2 style={{fontSize: '24px', fontWeight: '600', color: '#000000'}}>
                      Recommendations ({analysis!.recommendations.length})
                    </h2>
                  </div>
                </div>
                <div style={{padding: '0 32px 32px 32px'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    {analysis!.recommendations.slice(0, 5).map((rec, index) => (
                      <div key={index} style={{borderLeft: '4px solid #000000', paddingLeft: '16px'}}>
                        <div className="flex items-start justify-between gap-2">
                          <div style={{flex: 1}}>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 style={{fontSize: '17px', fontWeight: '600', color: '#000000'}}>{rec.title}</h4>
                              <span className={getBadgeClass(rec.severity)}>{rec.severity}</span>
                              <span className="badge" style={{backgroundColor: '#f5f5f7', color: '#000000', border: '1px solid #d2d2d7'}}>
                                {rec.category}
                              </span>
                            </div>
                            <p style={{fontSize: '15px', color: '#86868b', marginBottom: '8px'}}>{rec.description}</p>
                            <p style={{fontSize: '15px', fontWeight: '500', color: '#000000'}}>Action: {rec.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {analysis!.recommendations.length > 5 && (
                      <p style={{fontSize: '15px', color: '#86868b', textAlign: 'center'}}>
                        ... and {analysis!.recommendations.length - 5} more recommendations
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="card" style={{background: '#ffffff', border: '1px solid #d2d2d7', borderRadius: '18px'}}>
            <div style={{padding: '32px 32px 0 32px'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{fontSize: '24px'}}>📱</span>
                  <h2 style={{fontSize: '24px', fontWeight: '600', color: '#000000'}}>Site Preview</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`btn ${viewMode === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '8px 16px',
                      fontSize: '15px'
                    }}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`btn ${viewMode === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '8px 16px',
                      fontSize: '15px'
                    }}
                  >
                    Mobile
                  </button>
                </div>
              </div>
            </div>
            <div style={{padding: '0 32px 32px 32px'}}>
              <div 
                style={{
                  height: '600px',
                  width: '100%',
                  maxWidth: viewMode === 'mobile' ? '375px' : '100%',
                  margin: viewMode === 'mobile' ? '0 auto' : '0',
                  border: '1px solid #d2d2d7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <iframe
                  src={analysis!.url}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  title="Website Preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {setAnalysis(null); setUrl('');}} 
            className="btn btn-primary btn-large"
          >
            Analyze Another Site
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
