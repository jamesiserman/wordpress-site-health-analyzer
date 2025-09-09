import { AnalysisResult, SecurityResult, GDPRResult, AccessibilityResult, Recommendation } from './types';

export interface Env {
  // Define any environment variables here
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
      try {
        const targetUrl = url.searchParams.get('url');
        
        if (!targetUrl) {
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
        
        return new Response(JSON.stringify(analysis), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (error) {
        console.error('Analysis error:', error);
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

    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  },
};

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
  const lowerHtml = html.toLowerCase();
  
  // WordPress detection patterns
  const wpPatterns = [
    /wp-content/i,
    /wp-includes/i,
    /wp-admin/i,
    /wordpress/i,
    /<meta name="generator" content="wordpress/i,
    /wp-json/i,
    /xmlrpc\.php/i
  ];

  const isWordPress = wpPatterns.some(pattern => pattern.test(html));
  
  let detectionMethod = 'Not detected';
  let isHardened = false;
  let wordpressVersion: string | undefined;

  if (isWordPress) {
    // Check for version in generator meta tag
    const versionMatch = html.match(/<meta name="generator" content="WordPress ([0-9.]+)"/i);
    if (versionMatch) {
      wordpressVersion = versionMatch[1];
      detectionMethod = 'Generator meta tag';
    } else {
      // Check for other detection methods
      if (lowerHtml.includes('wp-content')) {
        detectionMethod = 'wp-content directory detected';
      } else if (lowerHtml.includes('wp-includes')) {
        detectionMethod = 'wp-includes directory detected';
      } else if (lowerHtml.includes('wp-json')) {
        detectionMethod = 'WordPress REST API detected';
        isHardened = true; // REST API suggests some hardening
      } else {
        detectionMethod = 'WordPress patterns detected';
        isHardened = true; // If only subtle patterns found, likely hardened
      }
    }
  }

  // Simple vulnerability check (in real implementation, you'd check against CVE databases)
  const vulnerabilities = [];
  
  // Check for common security issues
  if (wordpressVersion) {
    const version = parseFloat(wordpressVersion);
    if (version < 6.0) {
      vulnerabilities.push({
        component: 'WordPress Core',
        version: wordpressVersion,
        severity: 'high' as const,
        description: 'Outdated WordPress version detected'
      });
    }
  }

  // Calculate security score
  let score = 100;
  if (!isWordPress) score -= 20; // Not WordPress, can't assess WordPress-specific security
  if (vulnerabilities.length > 0) score -= vulnerabilities.length * 15;
  if (!isHardened && isWordPress) score -= 10;
  
  score = Math.max(0, Math.min(100, score));

  return {
    wordpressVersion,
    isWordPress,
    detectionMethod,
    isHardened,
    vulnerabilities,
    plugins: [], // Would require more complex analysis
    themes: [], // Would require more complex analysis
    score
  };
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

  // Security recommendations
  if (!security.isWordPress) {
    recommendations.push({
      category: 'security',
      severity: 'medium',
      title: 'WordPress Not Detected',
      description: 'This site does not appear to be running WordPress.',
      action: 'Verify that this is a WordPress site or check if WordPress detection is being blocked.'
    });
  } else if (security.isHardened) {
    recommendations.push({
      category: 'security',
      severity: 'low',
      title: 'Excellent Security Hardening',
      description: 'WordPress detected through subtle indicators while obvious signs are hidden - this is a security best practice.',
      action: 'Continue maintaining this security hardening approach to reduce attack surface.'
    });
  }

  if (security.vulnerabilities.length > 0) {
    const criticalVulns = security.vulnerabilities.filter(v => v.severity === 'critical');
    if (criticalVulns.length > 0) {
      recommendations.push({
        category: 'security',
        severity: 'critical',
        title: 'Critical Security Vulnerabilities Found',
        description: `${criticalVulns.length} critical vulnerabilities detected.`,
        action: 'Update WordPress core, plugins, and themes immediately.'
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
