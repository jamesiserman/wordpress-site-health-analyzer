import axios from 'axios';
import * as cheerio from 'cheerio';
import { SecurityAnalyzer } from './SecurityAnalyzer';
import { GDPRAnalyzer } from './GDPRAnalyzer';
import { AccessibilityAnalyzer } from './AccessibilityAnalyzer';
import { ScoreCalculator } from './ScoreCalculator';

export interface AnalysisResult {
  url: string;
  timestamp: string;
  security: SecurityResult;
  gdpr: GDPRResult;
  accessibility: AccessibilityResult;
  overallScore: number;
  categoryScores: {
    security: number;
    gdpr: number;
    accessibility: number;
  };
  recommendations: Recommendation[];
}

export interface SecurityResult {
  wordpressVersion?: string;
  isWordPress: boolean;
  detectionMethod: string;
  isHardened: boolean;
  vulnerabilities: Vulnerability[];
  plugins: Plugin[];
  themes: Theme[];
  score: number;
}

export interface GDPRResult {
  hasCookieBanner: boolean;
  hasPrivacyPolicy: boolean;
  trackers: Tracker[];
  score: number;
}

export interface AccessibilityResult {
  missingAltImages: number;
  headingIssues: string[];
  missingAriaLabels: number;
  score: number;
}

export interface Vulnerability {
  component: string;
  version?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface Plugin {
  name: string;
  version?: string;
  slug: string;
}

export interface Theme {
  name: string;
  version?: string;
  slug: string;
}

export interface Tracker {
  name: string;
  type: 'analytics' | 'advertising' | 'social' | 'other';
  detected: boolean;
}

export interface Recommendation {
  category: 'security' | 'gdpr' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
}

export class WordPressAnalyzer {
  private securityAnalyzer: SecurityAnalyzer;
  private gdprAnalyzer: GDPRAnalyzer;
  private accessibilityAnalyzer: AccessibilityAnalyzer;
  private scoreCalculator: ScoreCalculator;

  constructor() {
    this.securityAnalyzer = new SecurityAnalyzer();
    this.gdprAnalyzer = new GDPRAnalyzer();
    this.accessibilityAnalyzer = new AccessibilityAnalyzer();
    this.scoreCalculator = new ScoreCalculator();
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      // Fetch the website HTML
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        maxRedirects: 5,
        validateStatus: function (status) {
          return status < 500; // Accept any status code less than 500
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Run all analyses
      const security = await this.securityAnalyzer.analyze($, url);
      const gdpr = await this.gdprAnalyzer.analyze($, url);
      const accessibility = await this.accessibilityAnalyzer.analyze($);

      // Calculate scores
      const categoryScores = {
        security: security.score,
        gdpr: gdpr.score,
        accessibility: accessibility.score
      };

      const overallScore = this.scoreCalculator.calculateOverallScore(categoryScores);

      // Generate recommendations
      const recommendations = this.generateRecommendations(security, gdpr, accessibility);

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

  private generateRecommendations(
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
}
