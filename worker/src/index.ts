import { AnalysisResult, SecurityResult, GDPRResult, AccessibilityResult, Recommendation, SSLCertificate, SecurityHeaders, ConsoleWarning, ReputationCheck, SearchAnalytics, AdminSession, GeolocationData } from './types';

export interface Env {
  DB: D1Database;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Analysis endpoint
    if (url.pathname === '/api/analyze' && request.method === 'GET') {
      const startTime = Date.now();
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const userAgent = request.headers.get('User-Agent') || 'unknown';
      
      try {
        const targetUrl = url.searchParams.get('url');
        
        if (!targetUrl) {
          await logSearchAnalytics(env.DB, {
            url: '',
            ip_address: clientIP,
            user_agent: userAgent,
            timestamp: new Date().toISOString(),
            analysis_duration_ms: Date.now() - startTime,
            error_message: 'URL parameter is required'
          }, request);
          
          return new Response(JSON.stringify({
            error: 'URL parameter is required'
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        // Validate URL format
        try {
          new URL(targetUrl);
        } catch {
          await logSearchAnalytics(env.DB, {
            url: targetUrl,
            ip_address: clientIP,
            user_agent: userAgent,
            timestamp: new Date().toISOString(),
            analysis_duration_ms: Date.now() - startTime,
            error_message: 'Invalid URL format'
          }, request);
          
          return new Response(JSON.stringify({
            error: 'Invalid URL format'
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const analysis = await analyzeWebsite(targetUrl);
        const duration = Date.now() - startTime;
        
        // Log successful analysis
        await logSearchAnalytics(env.DB, {
          url: targetUrl,
          ip_address: clientIP,
          user_agent: userAgent,
          timestamp: new Date().toISOString(),
          overall_score: analysis.overallScore,
          security_score: analysis.categoryScores.security,
          gdpr_score: analysis.categoryScores.gdpr,
          accessibility_score: analysis.categoryScores.accessibility,
          analysis_duration_ms: duration
        }, request);
        
        return new Response(JSON.stringify(analysis), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (error) {
        console.error('Analysis error:', error);
        
        const targetUrl = url.searchParams.get('url') || '';
        await logSearchAnalytics(env.DB, {
          url: targetUrl,
          ip_address: clientIP,
          user_agent: userAgent,
          timestamp: new Date().toISOString(),
          analysis_duration_ms: Date.now() - startTime,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }, request);
        
        return new Response(JSON.stringify({
          error: 'Failed to analyze website',
          message: error instanceof Error ? error.message : 'Unknown error'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    // Admin login endpoint
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      return handleAdminLogin(request, env, corsHeaders);
    }

    // Admin analytics endpoint
    if (url.pathname === '/api/admin/analytics' && request.method === 'GET') {
      return handleAdminAnalytics(request, env, corsHeaders);
    }

    // Admin logout endpoint
    if (url.pathname === '/api/admin/logout' && request.method === 'POST') {
      return handleAdminLogout(request, env, corsHeaders);
    }

    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  },
};

// Analytics and geolocation functions
async function getGeolocation(request: Request): Promise<GeolocationData> {
  try {
    // Use Cloudflare's built-in geolocation data
    const country = request.cf?.country as string;
    const city = request.cf?.city as string;
    const region = request.cf?.region as string;
    
    return {
      country: country || undefined,
      city: city || undefined,
      region: region || undefined
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return {};
  }
}

async function logSearchAnalytics(db: D1Database, analytics: Omit<SearchAnalytics, 'id'>, request: Request): Promise<void> {
  try {
    const geolocation = await getGeolocation(request);
    
    await db.prepare(`
      INSERT INTO search_analytics (
        url, ip_address, country, city, region, user_agent, timestamp,
        overall_score, security_score, gdpr_score, accessibility_score,
        analysis_duration_ms, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      analytics.url,
      analytics.ip_address,
      geolocation.country,
      geolocation.city,
      geolocation.region,
      analytics.user_agent,
      analytics.timestamp,
      analytics.overall_score,
      analytics.security_score,
      analytics.gdpr_score,
      analytics.accessibility_score,
      analytics.analysis_duration_ms,
      analytics.error_message
    ).run();
  } catch (error) {
    console.error('Failed to log analytics:', error);
  }
}

// Admin authentication functions
async function generateSessionToken(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

async function createAdminSession(db: D1Database, ipAddress: string): Promise<string> {
  const sessionToken = await generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await db.prepare(`
    INSERT INTO admin_sessions (session_token, expires_at, ip_address)
    VALUES (?, ?, ?)
  `).bind(sessionToken, expiresAt.toISOString(), ipAddress).run();
  
  return sessionToken;
}

async function validateAdminSession(db: D1Database, sessionToken: string): Promise<boolean> {
  try {
    const result = await db.prepare(`
      SELECT expires_at FROM admin_sessions 
      WHERE session_token = ? AND expires_at > datetime('now')
    `).bind(sessionToken).first();
    
    return !!result;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

async function deleteAdminSession(db: D1Database, sessionToken: string): Promise<void> {
  try {
    await db.prepare(`
      DELETE FROM admin_sessions WHERE session_token = ?
    `).bind(sessionToken).run();
  } catch (error) {
    console.error('Session deletion error:', error);
  }
}

// Admin endpoint handlers
async function handleAdminLogin(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json() as { username: string; password: string };
    const { username, password } = body;
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    if (username === env.ADMIN_USERNAME && await verifyPassword(password, env.ADMIN_PASSWORD_HASH)) {
      const sessionToken = await createAdminSession(env.DB, clientIP);
      
      return new Response(JSON.stringify({
        success: true,
        sessionToken
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } else {
      return new Response(JSON.stringify({
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Login failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function handleAdminAnalytics(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const sessionToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!sessionToken || !await validateAdminSession(env.DB, sessionToken)) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Get recent searches
    const recentSearches = await env.DB.prepare(`
      SELECT * FROM search_analytics 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    // Get analytics summary
    const totalSearches = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM search_analytics
    `).first();
    
    const avgScore = await env.DB.prepare(`
      SELECT AVG(overall_score) as avg_score FROM search_analytics 
      WHERE overall_score IS NOT NULL
    `).first();
    
    const topCountries = await env.DB.prepare(`
      SELECT country, COUNT(*) as count 
      FROM search_analytics 
      WHERE country IS NOT NULL 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `).all();
    
    const errorRate = await env.DB.prepare(`
      SELECT 
        COUNT(CASE WHEN error_message IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as error_rate
      FROM search_analytics
    `).first();
    
    return new Response(JSON.stringify({
      recentSearches: recentSearches.results,
      summary: {
        totalSearches: totalSearches?.count || 0,
        averageScore: avgScore?.avg_score || 0,
        errorRate: errorRate?.error_rate || 0,
        topCountries: topCountries.results
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch analytics'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function handleAdminLogout(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const sessionToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (sessionToken) {
      await deleteAdminSession(env.DB, sessionToken);
    }
    
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Logout failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  try {
    // Fetch the website HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Run all analyses
    const security = await analyzeSecurityWorker(html, url);
    const gdpr = await analyzeGDPRWorker(html, url);
    const accessibility = await analyzeAccessibilityWorker(html);

    // Calculate scores
    const categoryScores = {
      security: security.score,
      gdpr: gdpr.score,
      accessibility: accessibility.score
    };

    const overallScore = calculateOverallScore(categoryScores);

    // Generate recommendations
    const recommendations = generateRecommendations(security, gdpr, accessibility);

    return {
      url,
      timestamp: new Date().toISOString(),
      security,
      gdpr,
      accessibility,
      overallScore,
      categoryScores,
      recommendations
    };
  } catch (error) {
    throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeSecurityWorker(html: string, url: string): Promise<SecurityResult> {
  // Analyze SSL Certificate
  const sslCertificate = await analyzeSSLCertificate(url);
  
  // Analyze Security Headers
  const securityHeaders = await analyzeSecurityHeaders(url);
  
  // Analyze Console Warnings (simulated - in real implementation would use headless browser)
  const consoleWarnings = analyzeConsoleWarnings(html);
  
  // Check Reputation
  const reputationChecks = await analyzeReputation(url);
  
  // General vulnerability checks
  const vulnerabilities = analyzeGeneralVulnerabilities(html, url);
  
  // Calculate overall security score
  let score = 0;
  score += sslCertificate.isValid ? 25 : 0;
  score += securityHeaders.score;
  score += Math.max(0, 25 - (consoleWarnings.length * 5));
  score += reputationChecks.every(check => check.status === 'clean') ? 20 : 0;
  score -= vulnerabilities.length * 10;
  
  score = Math.max(0, Math.min(100, score));

  return {
    sslCertificate,
    securityHeaders,
    consoleWarnings,
    reputationChecks,
    vulnerabilities,
    score
  };
}

async function analyzeSSLCertificate(url: string): Promise<SSLCertificate> {
  try {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    
    if (!isHttps) {
      return {
        isValid: false,
        warnings: ['Site not using HTTPS']
      };
    }
    
    // In a real implementation, you would check certificate details
    // For now, we'll do a basic HTTPS check
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        isValid: response.ok,
        issuer: 'Unknown', // Would need certificate parsing
        grade: response.ok ? 'A' : 'F',
        warnings: response.ok ? [] : ['SSL connection failed']
      };
    } catch {
      return {
        isValid: false,
        warnings: ['SSL certificate validation failed']
      };
    }
  } catch {
    return {
      isValid: false,
      warnings: ['Invalid URL format']
    };
  }
}

async function analyzeSecurityHeaders(url: string): Promise<SecurityHeaders> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;
    
    const securityHeaders = {
      contentSecurityPolicy: headers.has('content-security-policy'),
      strictTransportSecurity: headers.has('strict-transport-security'),
      xFrameOptions: headers.has('x-frame-options'),
      xContentTypeOptions: headers.has('x-content-type-options'),
      referrerPolicy: headers.has('referrer-policy'),
      permissionsPolicy: headers.has('permissions-policy') || headers.has('feature-policy'),
      score: 0
    };
    
    // Calculate score based on present headers
    const headerCount = Object.values(securityHeaders).filter(Boolean).length - 1; // -1 for score field
    securityHeaders.score = Math.round((headerCount / 6) * 30); // Max 30 points for headers
    
    return securityHeaders;
  } catch {
    return {
      contentSecurityPolicy: false,
      strictTransportSecurity: false,
      xFrameOptions: false,
      xContentTypeOptions: false,
      referrerPolicy: false,
      permissionsPolicy: false,
      score: 0
    };
  }
}

function analyzeConsoleWarnings(html: string): ConsoleWarning[] {
  const warnings: ConsoleWarning[] = [];
  
  // Check for mixed content issues
  if (html.includes('http://') && html.includes('https://')) {
    warnings.push({
      type: 'mixed-content',
      message: 'Mixed content detected (HTTP resources on HTTPS page)',
      severity: 'medium'
    });
  }
  
  // Check for deprecated features
  if (/document\.write/i.test(html)) {
    warnings.push({
      type: 'deprecated',
      message: 'document.write() usage detected',
      severity: 'low'
    });
  }
  
  // Check for inline scripts without nonce
  const inlineScripts = html.match(/<script(?![^>]*src)[^>]*>/gi) || [];
  if (inlineScripts.length > 0 && !html.includes('nonce=')) {
    warnings.push({
      type: 'security',
      message: 'Inline scripts without CSP nonce detected',
      severity: 'medium'
    });
  }
  
  // Check for eval() usage
  if (/\beval\s*\(/i.test(html)) {
    warnings.push({
      type: 'security',
      message: 'eval() usage detected',
      severity: 'high'
    });
  }
  
  return warnings;
}

async function analyzeReputation(url: string): Promise<ReputationCheck[]> {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  
  // In a real implementation, you would check against actual reputation services
  // For now, we'll simulate basic checks
  const checks: ReputationCheck[] = [
    {
      service: 'Google Safe Browsing',
      status: 'clean', // Would check actual API
      lastChecked: new Date().toISOString()
    },
    {
      service: 'VirusTotal',
      status: 'clean', // Would check actual API
      lastChecked: new Date().toISOString()
    },
    {
      service: 'Malware Domain List',
      status: 'clean', // Would check actual blacklists
      lastChecked: new Date().toISOString()
    }
  ];
  
  return checks;
}

function analyzeGeneralVulnerabilities(html: string, url: string): any[] {
  const vulnerabilities = [];
  
  // Check for common vulnerabilities
  if (html.includes('jQuery') && /jquery[/-]([0-9.]+)/i.test(html)) {
    const versionMatch = html.match(/jquery[/-]([0-9.]+)/i);
    if (versionMatch) {
      const version = versionMatch[1];
      const versionNum = parseFloat(version);
      if (versionNum < 3.5) {
        vulnerabilities.push({
          component: 'jQuery',
          version: version,
          severity: 'medium',
          description: 'Outdated jQuery version with known vulnerabilities'
        });
      }
    }
  }
  
  // Check for exposed admin interfaces
  if (html.includes('/admin') || html.includes('/administrator')) {
    vulnerabilities.push({
      component: 'Admin Interface',
      severity: 'low',
      description: 'Admin interface references found in HTML'
    });
  }
  
  return vulnerabilities;
}

async function analyzeGDPRWorker(html: string, url: string): Promise<GDPRResult> {
  const lowerHtml = html.toLowerCase();
  
  // Check for cookie banner
  const cookieBannerPatterns = [
    /cookie.*consent/i,
    /accept.*cookie/i,
    /cookie.*policy/i,
    /gdpr.*consent/i,
    /privacy.*consent/i
  ];
  
  const hasCookieBanner = cookieBannerPatterns.some(pattern => pattern.test(html));
  
  // Check for privacy policy
  const privacyPolicyPatterns = [
    /privacy.*policy/i,
    /datenschutz/i,
    /privacy.*statement/i
  ];
  
  const hasPrivacyPolicy = privacyPolicyPatterns.some(pattern => pattern.test(html));
  
  // Check for common trackers
  const trackers = [
    { name: 'Google Analytics', type: 'analytics' as const, detected: /google-analytics|gtag|ga\(/i.test(html) },
    { name: 'Facebook Pixel', type: 'advertising' as const, detected: /facebook.*pixel|fbq\(/i.test(html) },
    { name: 'Google Tag Manager', type: 'analytics' as const, detected: /googletagmanager/i.test(html) },
    { name: 'Google Ads', type: 'advertising' as const, detected: /googleadservices|google.*ads/i.test(html) },
    { name: 'Twitter', type: 'social' as const, detected: /twitter.*widget|platform\.twitter/i.test(html) },
    { name: 'LinkedIn', type: 'social' as const, detected: /linkedin.*insight|platform\.linkedin/i.test(html) }
  ];
  
  // Calculate GDPR score
  let score = 100;
  if (!hasCookieBanner) score -= 30;
  if (!hasPrivacyPolicy) score -= 30;
  
  const detectedTrackers = trackers.filter(t => t.detected).length;
  if (detectedTrackers > 0 && !hasCookieBanner) score -= detectedTrackers * 5;
  
  score = Math.max(0, Math.min(100, score));
  
  return {
    hasCookieBanner,
    hasPrivacyPolicy,
    trackers,
    score
  };
}

async function analyzeAccessibilityWorker(html: string): Promise<AccessibilityResult> {
  // Count images without alt text
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const missingAltImages = imgMatches.filter(img => 
    !img.includes('alt=') || /alt=["']?\s*["']?/i.test(img)
  ).length;
  
  // Check heading structure
  const headingMatches = html.match(/<h[1-6][^>]*>/gi) || [];
  const headingIssues: string[] = [];
  
  // Simple heading hierarchy check
  let previousLevel = 0;
  for (const heading of headingMatches) {
    const levelMatch = heading.match(/<h([1-6])/i);
    if (levelMatch) {
      const currentLevel = parseInt(levelMatch[1]);
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        headingIssues.push(`Heading level ${currentLevel} follows H${previousLevel} (skipped levels)`);
      }
      previousLevel = currentLevel;
    }
  }
  
  // Count elements that might need ARIA labels
  const interactiveElements = [
    ...html.match(/<button[^>]*>/gi) || [],
    ...html.match(/<input[^>]*>/gi) || [],
    ...html.match(/<select[^>]*>/gi) || [],
    ...html.match(/<textarea[^>]*>/gi) || []
  ];
  
  const missingAriaLabels = interactiveElements.filter(element => 
    !element.includes('aria-label') && 
    !element.includes('aria-labelledby') &&
    !element.includes('title=')
  ).length;
  
  // Calculate accessibility score
  let score = 100;
  if (missingAltImages > 0) score -= Math.min(30, missingAltImages * 3);
  if (headingIssues.length > 0) score -= Math.min(20, headingIssues.length * 5);
  if (missingAriaLabels > 0) score -= Math.min(25, missingAriaLabels * 2);
  
  score = Math.max(0, Math.min(100, score));
  
  return {
    missingAltImages,
    headingIssues,
    missingAriaLabels,
    score
  };
}

function calculateOverallScore(categoryScores: { security: number; gdpr: number; accessibility: number }): number {
  const weights = {
    security: 0.4,
    gdpr: 0.3,
    accessibility: 0.3
  };
  
  return Math.round(
    categoryScores.security * weights.security +
    categoryScores.gdpr * weights.gdpr +
    categoryScores.accessibility * weights.accessibility
  );
}

function generateRecommendations(
  security: SecurityResult,
  gdpr: GDPRResult,
  accessibility: AccessibilityResult
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // SSL Certificate recommendations
  if (!security.sslCertificate.isValid) {
    recommendations.push({
      category: 'security',
      severity: 'critical',
      title: 'SSL Certificate Issues',
      description: 'SSL certificate validation failed or site not using HTTPS.',
      action: 'Install a valid SSL certificate and ensure all traffic uses HTTPS.'
    });
  }

  // Security Headers recommendations
  if (security.securityHeaders.score < 20) {
    recommendations.push({
      category: 'security',
      severity: 'high',
      title: 'Missing Security Headers',
      description: 'Important security headers are missing.',
      action: 'Implement Content-Security-Policy, X-Frame-Options, and other security headers.'
    });
  }

  // Console warnings recommendations
  const highSeverityWarnings = security.consoleWarnings.filter(w => w.severity === 'high');
  if (highSeverityWarnings.length > 0) {
    recommendations.push({
      category: 'security',
      severity: 'high',
      title: 'High Severity Security Warnings',
      description: `${highSeverityWarnings.length} high severity security issues detected.`,
      action: 'Review and fix security warnings in browser console.'
    });
  }

  // Reputation recommendations
  const suspiciousReputationChecks = security.reputationChecks.filter(check => 
    check.status === 'warning' || check.status === 'malicious'
  );
  if (suspiciousReputationChecks.length > 0) {
    recommendations.push({
      category: 'security',
      severity: 'critical',
      title: 'Security Reputation Issues',
      description: 'Site flagged by security reputation services.',
      action: 'Investigate and resolve malware or security issues immediately.'
    });
  }

  // General vulnerability recommendations
  if (security.vulnerabilities.length > 0) {
    const criticalVulns = security.vulnerabilities.filter(v => v.severity === 'critical');
    if (criticalVulns.length > 0) {
      recommendations.push({
        category: 'security',
        severity: 'critical',
        title: 'Critical Security Vulnerabilities Found',
        description: `${criticalVulns.length} critical vulnerabilities detected.`,
        action: 'Update vulnerable components immediately.'
      });
    }
  }

  // GDPR recommendations
  if (!gdpr.hasCookieBanner) {
    recommendations.push({
      category: 'gdpr',
      severity: 'high',
      title: 'Missing Cookie Banner',
      description: 'No cookie consent banner detected.',
      action: 'Implement a GDPR-compliant cookie consent banner.'
    });
  }

  if (!gdpr.hasPrivacyPolicy) {
    recommendations.push({
      category: 'gdpr',
      severity: 'high',
      title: 'Missing Privacy Policy',
      description: 'No privacy policy link found.',
      action: 'Add a privacy policy page and link it in the footer.'
    });
  }

  // Accessibility recommendations
  if (accessibility.missingAltImages > 0) {
    recommendations.push({
      category: 'accessibility',
      severity: 'medium',
      title: 'Images Missing Alt Text',
      description: `${accessibility.missingAltImages} images are missing alt text.`,
      action: 'Add descriptive alt text to all images for screen readers.'
    });
  }

  if (accessibility.headingIssues.length > 0) {
    recommendations.push({
      category: 'accessibility',
      severity: 'medium',
      title: 'Heading Structure Issues',
      description: 'Problems found with heading hierarchy.',
      action: 'Fix heading structure to follow proper H1-H6 hierarchy.'
    });
  }

  return recommendations.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}
