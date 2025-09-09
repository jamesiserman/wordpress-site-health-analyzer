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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    console.log('🚀 Starting analysis for:', url.trim());
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      console.log('📡 Calling API service...');
      const result = await ApiService.analyzeWebsite(url.trim());
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
            title: 'Vulnerability Assessment',
            description: analysis.security.vulnerabilities.length > 0 
              ? `${analysis.security.vulnerabilities.length} security vulnerabilities detected`
              : 'No known vulnerabilities found'
          },
          {
            level: analysis.security.isWordPress && !analysis.security.wordpressVersion ? 'medium' : 'low',
            icon: analysis.security.wordpressVersion ? '📦' : '❓',
            title: 'Version Detection',
            description: analysis.security.wordpressVersion 
              ? `WordPress ${analysis.security.wordpressVersion} detected`
              : 'WordPress version could not be determined'
          },
          {
            level: analysis.security.isHardened ? 'low' : 'medium',
            icon: analysis.security.isHardened ? '🛡️' : '👁️',
            title: 'Security Hardening',
            description: analysis.security.isHardened
              ? 'WordPress indicators are properly hidden (security best practice)'
              : 'WordPress installation is easily detectable'
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
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="text-center mb-8">
            <div className="mb-6">
              <span className="text-6xl">📋</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{fontFamily: 'Crimson Text, serif', color: '#1f2937'}}>
              WordPress Site Health Report
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span>🔍</span>
              <span>🛡️</span>
              <span>⚖️</span>
              <span>♿</span>
            </div>
            <p className="text-lg max-w-2xl mx-auto" style={{color: '#4b5563', lineHeight: '1.8'}}>
              📊 Comprehensive analysis of your WordPress website for security vulnerabilities, 
              GDPR compliance, and accessibility standards. Get detailed recommendations with visual insights.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="card">
              <div className="card-content">
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div>
                    <label htmlFor="url" className="text-sm font-medium mb-2" style={{display: 'block', color: '#374151'}}>
                      🌐 Website URL
                    </label>
                    <input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    🔍 Analyze Website
                  </button>
                </form>
                
                <div className="mt-6 text-sm" style={{color: '#6b7280'}}>
                  <h4 className="font-medium mb-3" style={{color: '#374151'}}>📋 Analysis Report Includes:</h4>
                  <ul style={{listStyle: 'none', padding: 0, lineHeight: '1.8'}}>
                    <li>🛡️ Security: WordPress version, plugins, themes, vulnerabilities</li>
                    <li>⚖️ GDPR: Cookie banners, privacy policies, tracking scripts</li>
                    <li>♿ Accessibility: Alt text, heading structure, ARIA labels</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card" style={{maxWidth: '400px'}}>
          <div className="card-content text-center">
            <div className="mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <div className="animate-spin" style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid rgba(59, 130, 246, 0.1)',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              margin: '0 auto 1.5rem'
            }}></div>
            <h2 className="text-xl font-semibold mb-2" style={{color: '#1f2937'}}>📊 Analyzing Website</h2>
            <p style={{color: '#6b7280'}}>🔬 Running comprehensive health checks...</p>
            <div className="mt-4 text-sm" style={{color: '#9ca3af'}}>
              <div>🛡️ Checking security vulnerabilities</div>
              <div>⚖️ Scanning GDPR compliance</div>
              <div>♿ Testing accessibility standards</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card" style={{maxWidth: '400px'}}>
          <div className="card-content text-center">
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚠️</div>
            <h2 className="text-xl font-semibold mb-2" style={{color: '#dc2626'}}>Analysis Failed</h2>
            <p className="text-muted mb-4">{error}</p>
            <button 
              onClick={() => {setError(null); setUrl('');}} 
              className="btn btn-primary"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-5xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{fontFamily: 'Crimson Text, serif', color: '#1f2937'}}>
            Site Health Analysis Report
          </h1>
          <p className="text-muted">
            📅 {new Date(analysis!.timestamp).toLocaleDateString()} • 🌐 {analysis!.url}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Analysis Results */}
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold" style={{fontFamily: 'Crimson Text, serif'}}>
                  🏆 Overall Health Score
                </h2>
              </div>
              <div className="card-content text-center">
                <div className="mb-4">
                  <div className="text-6xl font-bold mb-2" style={{color: getScoreColor(analysis!.overallScore)}}>
                    {analysis!.overallScore}%
                  </div>
                  <div className="text-3xl font-bold" style={{color: getScoreColor(analysis!.overallScore)}}>
                    Grade {getScoreGrade(analysis!.overallScore)}
                  </div>
                </div>
                <div className="progress" style={{height: '1rem'}}>
                  <div 
                    className="progress-bar"
                    style={{width: `${analysis!.overallScore}%`}}
                  ></div>
                </div>
                <p className="text-sm text-muted mt-2">
                  📅 Analyzed on {new Date(analysis!.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-header" style={{paddingBottom: '0.75rem'}}>
                  <button 
                    className={`category-button security w-full text-left ${activeCategory === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === 'security' ? null : 'security')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛡️</span>
                      <h3 className="font-semibold" style={{fontFamily: 'Crimson Text, serif', fontSize: '1.25rem'}}>Security</h3>
                      <span className="ml-auto text-sm" style={{color: '#64748b'}}>Click for details</span>
                    </div>
                  </button>
                </div>
                <div className="card-content">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold" style={{color: getScoreColor(analysis!.categoryScores.security)}}>
                        {analysis!.categoryScores.security}%
                      </span>
                      <span className="text-2xl">{getScoreGrade(analysis!.categoryScores.security)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{color: '#6b7280'}}>
                        {analysis!.security.vulnerabilities.length === 0 ? '✨ No Issues' : `⚠️ ${analysis!.security.vulnerabilities.length} Issues`}
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '0.75rem'}}>
                    <div 
                      className="progress-bar security" 
                      style={{width: `${analysis!.categoryScores.security}%`}}
                    ></div>
                  </div>
                  <div className="mt-3 text-sm">
                    {analysis!.security.isWordPress ? (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {analysis!.security.isHardened ? '🛡️' : '✅'} WordPress detected
                          {analysis!.security.isHardened && <span className="badge low">Hardened</span>}
                        </div>
                        <div className="text-muted" style={{fontSize: '0.75rem', lineHeight: '1.4'}}>
                          {analysis!.security.detectionMethod}
                        </div>
                        {analysis!.security.wordpressVersion && (
                          <div className="text-muted mt-1">📦 Version: {analysis!.security.wordpressVersion}</div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>❌</span>
                        <span>WordPress not detected</span>
                      </div>
                    )}
                  </div>
                  {activeCategory === 'security' && (
                    <div className="risk-panel">
                      <h4 className="font-semibold mb-3" style={{color: '#1e293b'}}>Security Risk Assessment</h4>
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

              <div className="card">
                <div className="card-header" style={{paddingBottom: '0.75rem'}}>
                  <button 
                    className={`category-button gdpr w-full text-left ${activeCategory === 'gdpr' ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === 'gdpr' ? null : 'gdpr')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      <h3 className="font-semibold" style={{fontFamily: 'Crimson Text, serif', fontSize: '1.25rem'}}>GDPR</h3>
                      <span className="ml-auto text-sm" style={{color: '#64748b'}}>Click for details</span>
                    </div>
                  </button>
                </div>
                <div className="card-content">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold" style={{color: getScoreColor(analysis!.categoryScores.gdpr)}}>
                        {analysis!.categoryScores.gdpr}%
                      </span>
                      <span className="text-2xl">{getScoreGrade(analysis!.categoryScores.gdpr)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{color: '#6b7280'}}>
                        📊 {analysis!.gdpr.trackers.filter(t => t.detected).length} Trackers
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '0.75rem'}}>
                    <div 
                      className="progress-bar gdpr" 
                      style={{width: `${analysis!.categoryScores.gdpr}%`}}
                    ></div>
                  </div>
                  <div className="mt-3 text-sm space-y-1">
                    <div className="flex items-center gap-1">
                      {analysis!.gdpr.hasCookieBanner ? '✅' : '❌'} 
                      <span>Cookie consent banner</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {analysis!.gdpr.hasPrivacyPolicy ? '✅' : '❌'} 
                      <span>Privacy policy link</span>
                    </div>
                  </div>
                  {activeCategory === 'gdpr' && (
                    <div className="risk-panel">
                      <h4 className="font-semibold mb-3" style={{color: '#1e293b'}}>GDPR Compliance Assessment</h4>
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

              <div className="card">
                <div className="card-header" style={{paddingBottom: '0.75rem'}}>
                  <button 
                    className={`category-button accessibility w-full text-left ${activeCategory === 'accessibility' ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === 'accessibility' ? null : 'accessibility')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">♿</span>
                      <h3 className="font-semibold" style={{fontFamily: 'Crimson Text, serif', fontSize: '1.25rem'}}>Accessibility</h3>
                      <span className="ml-auto text-sm" style={{color: '#64748b'}}>Click for details</span>
                    </div>
                  </button>
                </div>
                <div className="card-content">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold" style={{color: getScoreColor(analysis!.categoryScores.accessibility)}}>
                        {analysis!.categoryScores.accessibility}%
                      </span>
                      <span className="text-2xl">{getScoreGrade(analysis!.categoryScores.accessibility)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{color: '#6b7280'}}>
                        {(analysis!.accessibility.missingAltImages + analysis!.accessibility.headingIssues.length + analysis!.accessibility.missingAriaLabels) === 0 ? '✨ Perfect' : `⚠️ ${analysis!.accessibility.missingAltImages + analysis!.accessibility.headingIssues.length + analysis!.accessibility.missingAriaLabels} Issues`}
                      </div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '0.75rem'}}>
                    <div 
                      className="progress-bar accessibility" 
                      style={{width: `${analysis!.categoryScores.accessibility}%`}}
                    ></div>
                  </div>
                  <div className="mt-3 text-sm space-y-1">
                    <div className="flex items-center gap-1">
                      <span>🖼️</span>
                      <span>Missing alt text: {analysis!.accessibility.missingAltImages}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📝</span>
                      <span>Heading issues: {analysis!.accessibility.headingIssues.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🏷️</span>
                      <span>Missing ARIA labels: {analysis!.accessibility.missingAriaLabels}</span>
                    </div>
                  </div>
                  {activeCategory === 'accessibility' && (
                    <div className="risk-panel">
                      <h4 className="font-semibold mb-3" style={{color: '#1e293b'}}>Accessibility Assessment</h4>
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
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    <h2 className="text-xl font-semibold" style={{fontFamily: 'Crimson Text, serif'}}>
                      Recommendations ({analysis!.recommendations.length})
                    </h2>
                  </div>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    {analysis!.recommendations.slice(0, 5).map((rec, index) => (
                      <div key={index} className="border-l-4 pl-4" style={{borderLeftColor: '#3b82f6'}}>
                        <div className="flex items-start justify-between gap-2">
                          <div style={{flex: 1}}>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{rec.title}</h4>
                              <span className={getBadgeClass(rec.severity)}>{rec.severity}</span>
                              <span className="badge" style={{backgroundColor: '#f3f4f6', color: '#374151'}}>
                                {rec.category}
                              </span>
                            </div>
                            <p className="text-sm text-muted mb-2">{rec.description}</p>
                            <p className="text-sm font-medium">💡 Action: {rec.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {analysis!.recommendations.length > 5 && (
                      <p className="text-sm text-muted text-center">
                        ... and {analysis!.recommendations.length - 5} more recommendations
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <h2 className="text-xl font-semibold" style={{fontFamily: 'Crimson Text, serif'}}>Site Preview</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`btn ${viewMode === 'desktop' ? 'btn-primary' : ''}`}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      backgroundColor: viewMode === 'desktop' ? undefined : '#f3f4f6',
                      color: viewMode === 'desktop' ? undefined : '#374151'
                    }}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`btn ${viewMode === 'mobile' ? 'btn-primary' : ''}`}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      backgroundColor: viewMode === 'mobile' ? undefined : '#f3f4f6',
                      color: viewMode === 'mobile' ? undefined : '#374151'
                    }}
                  >
                    📱 Mobile
                  </button>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div 
                className="overflow-hidden rounded-lg" 
                style={{
                  height: '600px',
                  width: '100%',
                  maxWidth: viewMode === 'mobile' ? '375px' : '100%',
                  margin: viewMode === 'mobile' ? '0 auto' : '0',
                  border: '1px solid #e5e7eb'
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
            className="btn btn-primary"
          >
            🔍 Analyze Another Site
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
